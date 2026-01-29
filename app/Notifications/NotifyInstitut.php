<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyInstitut extends Notification implements ShouldQueue
{
    use Queueable;
    public $subject;
    public $messagesLines;
    public $actionRoute;
    public $actionText;

    /**
     * Create a new notification instance.
     */
    public function __construct($subject, $messagesLines, $actionText = "", $actionRoute = "")
    {
        $this->subject = $subject;
        $this->messagesLines = $messagesLines;
        $this->actionText = $actionText;
        $this->actionRoute = $actionRoute;
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
        $mailMessage = (new MailMessage)
            ->subject($this->subject . ' !')
            ->greeting('Salut ' . $notifiable->username . ' ,');

        if (is_array($this->messagesLines)) {
            foreach ($this->messagesLines as $line) {
                $mailMessage->line($line);
            }
        } else {
            $mailMessage->line($this->messagesLines);
        }
        // Ajout de l'action uniquement si $this->actionRoute n'est pas vide
        if (!empty($this->actionRoute)) {
            $mailMessage->action($this->actionText, url("$this->actionRoute"));
        }

        $mailMessage->line('Merci !');

        return $mailMessage;
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
