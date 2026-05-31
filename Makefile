.PHONY: help dev build up down restart logs clean pack

.DEFAULT_GOAL := help

TAG := $(shell git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD)

help: ## 显示帮助信息
	@echo "可用命令："
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

dev: ## 启动开发环境（热更新，端口 5173）
	docker compose up dev

build: ## 构建生产镜像
	docker compose build

up: ## 启动生产环境（端口 8080）
	docker compose up -d prod

down: ## 停止所有服务
	docker compose down

restart: ## 重启生产环境
	docker compose down
	docker compose up -d prod

logs: ## 查看生产环境日志
	docker compose logs -f prod

PLATFORM ?= linux/amd64

pack: ## 构建镜像并打标签（tag 优先，否则用 commit hash）
	@echo "标签: $(TAG)  平台: $(PLATFORM)"
	docker buildx build --platform $(PLATFORM) -t homepage -t homepage:$(TAG) --load .

clean: ## 停止服务并清理构建产物
	docker compose down
	rm -rf dist node_modules *.tar
