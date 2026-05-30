.PHONY: help dev build up down restart logs clean

.DEFAULT_GOAL := help

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

clean: ## 停止服务并清理构建产物
	docker compose down
	rm -rf dist node_modules
