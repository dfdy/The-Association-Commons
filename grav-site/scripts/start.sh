#!/bin/sh
set -eu
cd /var/www/html
if [ ! -f user/.commons-initialized ]; then
    # Never copy over or clear the bind-mounted repository content.
    for entry in /opt/grav-default-user/* /opt/grav-default-user/.[!.]*; do
        [ -e "$entry" ] || continue
        [ "$(basename "$entry")" = pages ] && continue
        cp -a "$entry" user/
    done
    for entry in /opt/commons-user/*; do
        [ "$(basename "$entry")" = pages ] && continue
        cp -a "$entry" user/
    done
    touch user/.commons-initialized
fi
# Update application code; content is mounted from Git, secrets stay in the volume.
cp -a /opt/commons-user/themes/commons user/themes/
cp -a /opt/commons-user/plugins/commons user/plugins/
cp -a /opt/commons-user/plugins/remember-panel user/plugins/
cp -a /opt/commons-user/plugins/language-menu user/plugins/
cp -a /opt/commons-user/plugins/hero-intro user/plugins/
cp -a /opt/commons-user/plugins/glossary user/plugins/
cp -a /opt/commons-user/plugins/section-layout user/plugins/
cp -a /opt/commons-user/plugins/read-aloud user/plugins/
cp -a /opt/commons-user/plugins/translation-notice user/plugins/
cp -a /opt/commons-user/plugins/legal-matrix user/plugins/
cp -a /opt/commons-user/plugins/governance-patterns user/plugins/
mkdir -p user/data/commons-private
chmod 700 user/data/commons-private
# Exclude the checkout from recursive chown: Docker on Linux must not take
# ownership of the contributor's files. Grant the web worker group access instead.
find user -path user/pages -prune -o -exec chown www-data:www-data {} +
if [ ! -w user/pages ]; then
    printf '%s\n' 'Grav content is read-only. Enable a writable Docker/Colima share for this checkout.' >&2
    exit 1
fi
pages_group=$(stat -c %g user/pages)
if ! id -G www-data | tr ' ' '\n' | grep -qx "$pages_group"; then
    if ! getent group "$pages_group" >/dev/null; then
        groupadd -g "$pages_group" commons-content
    fi
    usermod -a -G "$pages_group" www-data
fi
umask 0002
find user/pages -type d -exec chmod g+rwxs {} +
find user/pages -type f -exec chmod g+rw {} +
chown -R www-data:www-data cache logs tmp backup images assets 2>/dev/null || true
su -s /bin/sh www-data -c "php /opt/commons-scripts/provision.php"
exec "$@"
