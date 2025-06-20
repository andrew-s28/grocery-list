# syntax=docker/dockerfile:1
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app
RUN mkdir /usr/src/app/data

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY . /usr/src/app/
RUN uv pip compile pyproject.toml -o requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]

EXPOSE 8001
# CMD ["gunicorn grocery_api.wsgi:application \
#     --env DJANGO_SETTINGS_MODULE=.env \
#     --name grocery_api \
#     --bind 0.0.0.0:8001 \
#     --timeout 600 \
#     --workers 4 \
#     --log-level=info \
#     --reload"]