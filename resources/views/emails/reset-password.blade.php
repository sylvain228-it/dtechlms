<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
</head>

<body style="font-family: Arial;">
    <h2>Réinitialisation du mot de passe</h2>

    <p>Bonjour {{ $user->name }},</p>

    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>

    <p style="margin: 30px 0;">
        <a href="{{ $url }}"
            style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;">
            Réinitialiser mon mot de passe
        </a>
    </p>

    <p>Ce lien expirera dans <strong>60 minutes</strong>.</p>

    <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>

    <p>— {{ config('app.name') }}</p>
</body>

</html>
