<?php

namespace App\Traits;

use App\Models\EntityType;
use App\Models\EventCalendar;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait AppUtilityTrait
{
    function uniqueSlug($model, $title, $object_id = 0): string
    {
        $slug = Str::slug($title);
        $originSlug = $slug;
        $count = 1;
        while (true) {
            if ($object_id > 0) {
                if (!$model::where('slug', $slug)->whereNot('id', $object_id)->first()) {
                    break;
                }
            }
            if (!$model::where('slug', $slug)->first()) {
                break;
            }
            $slug = $originSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    function normalizePhoneNumber(string $input): ?string
    {
        // Supprimer espaces, tirets, parenthèses
        $number = preg_replace('/[\s\-\(\)]/', '', $input);

        // Supprimer indicatifs +228, 00228, ou 228 s’ils existent
        $number = preg_replace('/^(?:\+228|00228|228)/', '', $number);

        // Vérifier si le reste fait bien 8 chiffres
        if (preg_match('/^\d{8}$/', $number)) {
            return '+228' . $number;
        }

        return null;
    }

    public function sendOtp($mobile)
    {
        $url = 'https://www.nicelia.com/sms-api/public/index.php?send-otp';

        $response = Http::post($url, [
            'sender' => 'Nicelia',
            'mobile' => $mobile,
        ]);
        if ($response === null) {
            return [
                'status' => 'no'
            ];
        }
        if ($response->successful()) {
            $data = $response->json();
            $otp = $data['otp'] ?? null;
            $status = "ok";

            return [
                'status' => $status,
                'otp' => $otp,
            ];
        } else {
            return [
                'status' => 'no'
            ];
        }
    }

    function generateUsername($email): string
    {
        $maxAttempts = 10;
        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $numDigits = 4;
            $username = strtolower(explode('@', $email)[0]);
            $usernamePart = Str::limit($username, 7, '');

            $missingLength = 7 - strlen($usernamePart);
            if ($missingLength > 0) {
                $numDigits += $missingLength;
            }

            $min = (int) str_pad('1', $numDigits, '0');
            $max = (int) str_pad('9', $numDigits, '9');
            $numericPart = random_int($min, $max);

            $code = strtolower($usernamePart . $numericPart);

            if (!User::where('username', $code)->exists()) {
                return $code;
            }
        }

        throw new \Exception("Impossible de générer un code unique après {$maxAttempts} tentatives.");
    }

    public function parseModel($name)
    {
        $entity = EntityType::where('name', $name)->first();
        if (!$entity) {
            return null;
        }
        $modelPath = 'App\\Models\\' . ucfirst(strtolower($entity->name));
        return $modelPath ? app($modelPath) : null;
    }
    public function entityModelPath($name)
    {
        $entity = EntityType::where('name', $name)->first();
        if (!$entity) {
            return null;
        }
        $modelPath = 'App\\Models\\' . ucfirst(strtolower($entity->name));
        return $modelPath;
    }

    public function getCourseId($entityType, $entityId)
    {
        $object = $this->parseModel($entityType)::find($entityId);
        if (!$object) {
            return null;
        }
        return $object->course_id;
    }

    public function saveOrUpdateEvent($data)
    {
        try {
            $event = EventCalendar::where('eventable_type', $data['eventable_type'])
                ->where('eventable_id', $data['eventable_id'])
                ->first();
            if (!$event) {
                $event = new EventCalendar();
            }
            $event->fill($data);
            $event->save();
            return true;
        } catch (\Exception $e) {
            Log::error('Error saving or updating event: ' . $e->getMessage());
            return false;
        }
    }
}
