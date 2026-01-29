import { Activity, Sequence } from '@/types/models/course';

export default function SequenceDetailsShared({
    sequence,
}: {
    sequence: Sequence;
}) {
    const activities = (sequence.activities || []) as Activity[];
    return (
        <>
            <div className="mx-auto px-5 md:px-20">
                <div>
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        {sequence.title}
                    </h2>
                    <p className="mb-4 text-gray-600">{sequence.description}</p>
                </div>
                <div className="mt-6">
                    <h3 className="mb-4 text-xl font-semibold text-gray-800">
                        Activités de la séquence
                    </h3>
                </div>
            </div>
        </>
    );
}
