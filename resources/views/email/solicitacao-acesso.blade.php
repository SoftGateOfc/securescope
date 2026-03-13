<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: bold;
        }
        .content {
            padding: 35px 30px;
        }
        .intro {
            font-size: 15px;
            color: #374151;
            margin-bottom: 25px;
        }
        .info-box {
            background-color: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            border-radius: 6px;
            padding: 20px 25px;
            margin-bottom: 25px;
        }
        .info-row {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e0f2fe;
        }
        .info-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .info-row:first-child {
            padding-top: 0;
        }
        .info-label {
            font-weight: bold;
            color: #1f2937;
            min-width: 90px;
            font-size: 14px;
        }
        .info-value {
            color: #4b5563;
            font-size: 14px;
        }
        .info-value a {
            color: #0ea5e9;
            text-decoration: none;
        }
        .timestamp {
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .footer {
            background-color: #f9fafb;
            padding: 18px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">

        <!-- CABEÇALHO -->
        <div class="header">
            <h1> Nova Solicitação de Acesso</h1>
        </div>

        <!-- CONTEÚDO -->
        <div class="content">
            <p class="intro">
                Uma nova solicitação de acesso à plataforma 
                <strong>Secure Scope</strong> foi recebida:
            </p>

            <!-- DADOS -->
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label"> Nome</span>
                    <span class="info-value">{{ $nome }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"> Empresa</span>
                    <span class="info-value">{{ $empresa }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"> Email</span>
                    <span class="info-value">
                        <a href="mailto:{{ $email }}">{{ $email }}</a>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label"> Telefone</span>
                    <span class="info-value">{{ $telefone }}</span>
                </div>
            </div>

            <!-- DATA/HORA -->
            <div class="timestamp">
                Solicitação recebida em {{ $data_hora }}
            </div>
        </div>

        <!-- RODAPÉ -->
        <div class="footer">
            <p style="margin: 0;">
                Email automático gerado pela plataforma Secure Scope.
            </p>
            <p style="margin: 5px 0 0 0;">
                © {{ date('Y') }} Secure Scope. Todos os direitos reservados.
            </p>
        </div>

    </div>
</body>
</html>