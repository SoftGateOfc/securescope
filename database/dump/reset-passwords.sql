-- Script para resetar a senha do usuário id=1 para 123123 e atualizar email para teste@gmail.com
UPDATE users SET senha = '$2y$10$l1AT2KoUjbm8SFEFMcBfuOLo1WhW/zgyqDOmWQG2LX0zSMOpVfUwW', email = 'teste@gmail.com' WHERE id = 1;
