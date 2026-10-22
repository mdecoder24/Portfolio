'use client';

import { useUi, type MotionPref, type QualityPref } from '@/stores/ui';

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden="true" className="type-small text-ink-2">
        {label}
      </span>
      <div className="flex rounded-control border border-rule p-0.5">
        {options.map((o) => (
          <label
            key={o.value}
            className="relative inline-flex min-h-7 cursor-pointer items-center rounded-control px-3 type-small text-ink-2 transition-colors duration-150 hover:text-ink has-checked:bg-plate-hover has-checked:text-ink has-focus-visible:shadow-focus"
          >
            <input
              type="radio"
              name={label}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function PreferenceToggles({ threeD }: { threeD: boolean }) {
  const motion = useUi((s) => s.motionPref);
  const quality = useUi((s) => s.qualityPref);
  const setMotion = useUi((s) => s.setMotionPref);
  const setQuality = useUi((s) => s.setQualityPref);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Segmented<MotionPref>
        label="Motion"
        value={motion}
        options={[
          { value: 'auto', label: 'Auto' },
          { value: 'reduced', label: 'Reduced' },
          { value: 'full', label: 'Full' },
        ]}
        onChange={setMotion}
      />
      {threeD && (
        <Segmented<QualityPref>
          label="3D"
          value={quality}
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'low', label: 'Low' },
            { value: 'off', label: 'Off' },
          ]}
          onChange={setQuality}
        />
      )}
    </div>
  );
}
