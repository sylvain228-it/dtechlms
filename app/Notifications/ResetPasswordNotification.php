<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $token;

    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = URL::temporarySignedRoute(
            'auth.password.reset',
            now()->addMinutes(60),
            [
                'token' => $this->token,
                'email' => $notifiable->email,
            ]
        );

        // return (new MailMessage)
        //     ->subject('Réinitialisation de votre mot de passe')
        //     ->greeting('Bonjour ' . $notifiable->name . ',')
        //     ->line('Vous avez demandé la réinitialisation de votre mot de passe.')
        //     ->action('Réinitialiser mon mot de passe', $url)
        //     ->line('Ce lien expirera dans 60 minutes.')
        //     ->line('Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.')
        //     ->salutation('— L\'équipe ' . config('app.name'));
        return (new MailMessage)
            ->subject('Réinitialisation du mot de passe')
            ->view('emails.reset-password', [
                'url' => $url,
                'user' => $notifiable,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
