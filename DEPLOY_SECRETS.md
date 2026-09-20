# Секреты и настройки автоматической раскатки

Документ фиксирует минимальный набор данных для GitHub Actions, который понадобится
для автоматической выкладки production из ветки `main`.

Значения секретов в репозиторий, этот файл и логи GitHub Actions не записывать.

## Обязательные GitHub Actions secrets

Добавить в настройках репозитория: `Settings → Secrets and variables → Actions`.

| Имя | Что положить | Для чего нужно |
| --- | --- | --- |
| `DEPLOY_SSH_PRIVATE_KEY` | Приватный ключ SSH в формате OpenSSH, отдельный для деплоя и без passphrase | Подключение GitHub Actions к серверу без интерактивного ввода |
| `DEPLOY_KNOWN_HOSTS` | Строка из `ssh-keyscan` с заранее проверенным fingerprint нового сервера | Защита от подключения не к тому серверу |
| `DEPLOY_HOST` | Домен или IP нового сервера | Адрес сервера |
| `DEPLOY_USER` | Отдельный пользователь деплоя, например `deploy` | Подключение без использования `root` |

## Условная настройка

| Имя | Когда нужно |
| --- | --- |
| `DEPLOY_PORT` | Только если SSH работает не на стандартном порту `22`. При порте `22` секрет не нужен. |

## GitHub Actions Variables

Добавить в `Settings → Secrets and variables → Actions → Variables`:

- `NEXT_PUBLIC_SITE_URL` — настоящий публичный адрес нового сайта;
- `NEXT_PUBLIC_YCLIENTS_URL` — прямая ссылка онлайн-записи;
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — необязательно, если подключаем Метрику.

Первые две переменные обязательны для production workflow. Они не являются секретами:
Next.js встраивает значения с префиксом `NEXT_PUBLIC_` в сборку во время `next build`.

## Что секретом не является

Эти значения не нужно прятать в GitHub Secrets:

- `NEXT_PUBLIC_SITE_URL` — публичный адрес сайта;
- `NEXT_PUBLIC_YCLIENTS_URL` — публичная ссылка онлайн-записи;
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — публичный идентификатор счётчика, если он будет подключён;
- health-check URL и имя systemd-сервиса.

Публичные переменные можно хранить в репозитории в `.env.example` или передавать
как GitHub Actions Variables. Секретных API-ключей и паролей в текущем приложении
не обнаружено.

## План раскатки

1. Push в `main` запускает GitHub Actions.
2. Actions устанавливает зависимости через `npm ci`, запускает lint, тесты и production build.
3. Только после успешных проверок создаётся архив именно из текущего коммита Git.
4. Архив передаётся на новый сервер по SSH в отдельный каталог релиза и проверяется по SHA-256.
5. Новый процесс запускается на свободном локальном порту и проверяется health-check запросом.
6. Если проверка успешна, production переключается на новый релиз атомарно.
7. Если сборка, запуск или health-check не проходят, workflow завершается с ошибкой,
   а текущая рабочая версия не переключается либо автоматически восстанавливается.

На сервере потребуется только первоначальная настройка стандартного runtime:
Node.js, systemd, nginx, пользователь `deploy`, каталог релизов и SSH-ключ.
Скрипт для этого лежит в [`ops/server-bootstrap.sh`](./ops/server-bootstrap.sh).
Логика каждого релиза лежит в [`ops/deploy-release.sh`](./ops/deploy-release.sh)
и выполняется из текущего коммита GitHub Actions.

## Что нужно будет подготовить на новом сервере

1. Подготовить чистый Debian/Ubuntu-сервер и получить его публичный SSH fingerprint
   через доверенный канал провайдера.
2. Локально создать отдельную пару Ed25519 для деплоя:

   ```bash
   ssh-keygen -t ed25519 -N "" -f karier-deploy-ed25519 -C karier-github-actions
   ```

   Приватный файл добавить только в `DEPLOY_SSH_PRIVATE_KEY`, публичный файл
   передать в bootstrap.
3. Передать `ops/server-bootstrap.sh` и публичный ключ на сервер и один раз запустить
   bootstrap от `root`:

   ```bash
   scp ops/server-bootstrap.sh karier-deploy-ed25519.pub root@SERVER:/tmp/
   ssh root@SERVER \
     'bash /tmp/server-bootstrap.sh example.ru /tmp/karier-deploy-ed25519.pub'
   ```

   Вместо `example.ru` указать настоящий домен нового стенда.
4. Проверить fingerprint нового сервера через доверенный канал и получить строку для
   `DEPLOY_KNOWN_HOSTS`:

   ```bash
   ssh-keyscan -t ed25519 SERVER
   ```

   Не принимать результат без сверки с fingerprint у провайдера.
5. Сохранить проверенную строку fingerprint в `DEPLOY_KNOWN_HOSTS`.
6. Добавить четыре обязательных значения в GitHub Actions Secrets и три публичные
   переменные из раздела выше.
7. После первого push в `main` проверить workflow и доступность сайта.

В этом репозитории основная ветка сейчас называется `main`; именно её слушает workflow.

Пароль root, пароль пользователя сервера и значения публичных переменных в GitHub Secrets
для этой схемы не нужны.
