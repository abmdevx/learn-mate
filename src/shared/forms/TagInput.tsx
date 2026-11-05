import { useState } from "react";
import type { KeyboardEvent } from "react";
import { normalizeTopics } from "@/shared/normalizeTopics";

interface TagsInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const TagsInput = ({ value = [], onChange, placeholder }: TagsInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && input.trim()) {
      e.preventDefault();
      const topic = input.trim().toLowerCase();
      const normalizedValue = normalizeTopics(value);
      if (!normalizedValue.includes(topic)) {
        onChange([...normalizedValue, topic]);
      } else {
        onChange(normalizedValue);
      }
      setInput("");
    }

    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(normalizeTopics(value).slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(normalizeTopics(value).filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-2 bg-gray-900">
      {value.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1 bg-orange-500 text-gray-900 px-2 py-1 rounded-lg text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-xs font-bold"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent focus:outline-none text-white text-sm"
      />
    </div>
  );
};

export default TagsInput;