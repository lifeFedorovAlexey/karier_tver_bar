# Деплой «Карьер» на стенд

Текущий стенд:

- сервер: `root@5.42.119.142`
- приложение: `/var/www/karier`
- systemd unit: `karier.service`
- Node.js: 22+
- приложение слушает `127.0.0.1:3000`, наружу отдаётся через nginx

Пароль и другие секреты не записывать в репозиторий или этот файл. Для SSH использовать защищённый менеджер секретов/ввод пароля вручную и проверенный fingerprint сервера.

## Подготовка релиза локально

Собирать архив без зависимостей, старой сборки, Git-метаданных и предыдущих архивов:

```powershell
tar.exe -czf karier-deploy-current.tar.gz `
  --exclude=./node_modules `
  --exclude=./.next `
  --exclude=./.git `
  --exclude='*.tar.gz' .
```

Перед выкладкой проверить, что в `lib/site.ts` и `.env.example` указан нужный `NEXT_PUBLIC_YCLIENTS_URL`.

## Передача на сервер

Подключаться с закреплённым fingerprint хоста. Архив сначала передавать во временный файл:

```powershell
pscp.exe -batch -hostkey "<SERVER_FINGERPRINT>" `
  karier-deploy-current.tar.gz `
  root@5.42.119.142:/tmp/karier-deploy-current.tar.gz
```

Fingerprint нужно подтвердить один раз по доверенному каналу, а не принимать вслепую.

## Установка нового релиза

Каждый релиз распаковывать в отдельный каталог. Не распаковывать поверх рабочего `/var/www/karier`:

```bash
RELEASE=/opt/karier-releases/$(date +%Y%m%d-%H%M%S)
mkdir -p "$RELEASE"
tar -xzf /tmp/karier-deploy-current.tar.gz -C "$RELEASE"
cp /var/www/karier/.env.local "$RELEASE/.env.local"
sed -i 's|^NEXT_PUBLIC_YCLIENTS_URL=.*|NEXT_PUBLIC_YCLIENTS_URL=https://n1129088.yclients.ru|' "$RELEASE/.env.local"
chown -R deploy:deploy "$RELEASE"
```

### Зависимости и сборка

`NEXT_PUBLIC_*` встраиваются в клиентскую сборку во время `next build`, поэтому `.env.local` должен быть настроен **до** сборки.

Зависимости должны находиться внутри каталога релиза. Не делать symlink вида `release/node_modules -> /var/www/karier/node_modules`: Turbopack Next.js может завершиться ошибкой `Symlink [project]/node_modules is invalid, it points out of the filesystem root`.

Предпочтительный вариант — установить зависимости в самом релизе:

```bash
cd "$RELEASE"
npm ci
```

Если зависимости уже проверены и полностью совместимы с `package-lock.json`, допустимо скопировать их внутрь релиза:

```bash
cp -a /var/www/karier/node_modules "$RELEASE/node_modules"
chown -R deploy:deploy "$RELEASE/node_modules"
```

Перед сборкой остановить текущий сервис, чтобы старый Next.js не конкурировал с Turbopack за память:

```bash
systemctl stop karier.service
```

Если `stop` завис, сначала посмотреть состояние:

```bash
systemctl status karier.service --no-pager
systemctl show -p MainPID karier.service
```

Затем принудительно остановить процессы **только этого unit**, а не все Node-процессы на сервере:

```bash
systemctl kill --kill-who=all --signal=SIGKILL karier.service
```

После освобождения ресурсов собрать релиз. Для быстрой выкладки достаточно production-сборки:

```bash
runuser -u deploy -- sh -c "cd '$RELEASE' && npm run build"
```

Не запускать `npm run check` на production-стенде без необходимости: он дополнительно гоняет lint и тесты и увеличивает время и нагрузку. Проверки выполнять локально или в CI.

## Переключение релиза

Старую версию сохранять для отката. Команды выполнять по очереди и проверять код возврата:

```bash
systemctl stop karier.service
mv /var/www/karier /opt/karier-releases/pre-$(basename "$RELEASE")
mv "$RELEASE" /var/www/karier
systemctl daemon-reload
systemctl start karier.service
```

Проверить сервис и фактический HTML:

```bash
systemctl is-active karier.service
grep -n 'NEXT_PUBLIC_YCLIENTS_URL' /var/www/karier/.env.local
curl -fsS http://127.0.0.1:3000/contacts | grep -o 'https://n1129088.yclients.ru' | head -1
curl -fsS http://127.0.0.1/contacts | grep -o 'https://n1129088.yclients.ru' | head -1
```

Оба `curl` должны вернуть новую ссылку, а `systemctl is-active` — `active`.

## Откат

Если новый релиз не запускается:

```bash
systemctl stop karier.service
mv /var/www/karier /opt/karier-releases/failed-$(date +%Y%m%d-%H%M%S)
mv /opt/karier-releases/pre-<RELEASE_NAME> /var/www/karier
systemctl start karier.service
systemctl status karier.service --no-pager
```

После успешной проверки можно удалить временный архив из `/tmp`. Старые релизы удалять только после подтверждения, что откат больше не нужен.

## Ошибки, которых избегать

1. Не собирать новый релиз поверх рабочего каталога.
2. Не менять `NEXT_PUBLIC_YCLIENTS_URL` после `next build` — значение уже встроено в клиентский HTML/JS.
3. Не использовать внешний symlink на `node_modules` при сборке Next.js 16/Turbopack.
4. Не запускать тяжёлую сборку параллельно с production-сервисом на малом сервере.
5. Не использовать `killall -9 node npm`, если на сервере есть другие Node-приложения; управлять процессами через конкретный systemd unit.
6. Не принимать SSH fingerprint без проверки и не хранить пароль в командах, скриптах или Markdown.
