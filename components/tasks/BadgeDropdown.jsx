import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BadgeDropdown({
  value,
  onChange,
  disabled = false,
  size = "sm",
  options,
  getVariant,
  getLabel,
}) {
  return (
    <Select value={String(value)} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={`w-28 border-0 ${size === "sm" ? "h-7" : "h-8"}`}
      >
        <SelectValue>
          <Badge
            variant="outline"
            className={`text-[11px] ${getVariant(value)}`}
          >
            {getLabel(value)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[11px] ${getVariant(option.value)}`}
              >
                {option.label}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
