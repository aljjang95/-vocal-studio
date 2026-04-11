'use client';

interface UsageCounterProps {
  usage: number;
  limit: number;
}

export default function UsageCounter({ usage, limit }: UsageCounterProps) {
  const pct = Math.min((usage / limit) * 100, 100);
  const isNearLimit = usage >= limit * 0.8;

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.85rem] text-[#888]">이번 달 사용량</span>
        <span className={`text-[0.85rem] font-semibold ${isNearLimit ? 'text-red-500' : 'text-[#e5e5e5]'}`}>
          {usage}/{limit}곡
        </span>
      </div>
      <div className="h-1 bg-[#2a2a2a] rounded-sm overflow-hidden">
        <div
          className={`h-full rounded-sm transition-[width] duration-300 ${isNearLimit ? 'bg-red-500' : 'bg-purple-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
