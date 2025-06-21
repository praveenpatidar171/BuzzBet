'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

interface Props {
    data: { time: string; yesPrice: number; noPrice: number, yesCount: number, noCount: number }[];
}

export function SnapshotGraph({ data }: Props) {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 10]} tickCount={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="yesPrice" stroke="#00c853" name="YES Price" dot={false} />
                    <Line type="monotone" dataKey="noPrice" stroke="#d50000" name="NO Price" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
