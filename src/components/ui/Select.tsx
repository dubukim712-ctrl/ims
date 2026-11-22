import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
  disabled: boolean;
}

function getText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return getText(node.props.children);
  return "";
}

function getOptions(children: ReactNode): SelectOption[] {
  const options: SelectOption[] = [];

  const collect = (nodes: ReactNode, groupDisabled = false) => {
    Children.forEach(nodes, (node) => {
      if (
        !isValidElement<{
          children?: ReactNode;
          value?: string | number;
          label?: string;
          disabled?: boolean;
        }>(node)
      )
        return;
      if (node.type === "option") {
        const { children: optionChildren, value, label, disabled } = node.props;
        const text = label ?? getText(optionChildren);
        options.push({
          value: String(value ?? text),
          label: text,
          disabled: groupDisabled || Boolean(disabled),
        });
      } else if (node.type === "optgroup") {
        collect(
          node.props.children,
          groupDisabled || Boolean(node.props.disabled),
        );
      }
    });
  };

  collect(children);
  return options;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className,
      invalid,
      children,
      id,
      disabled,
      required,
      value,
      defaultValue,
      onBlur,
      onFocus,
      title,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-invalid": ariaInvalid,
      ...selectProps
    },
    forwardedRef,
  ) {
    const options = getOptions(children);
    const listId = useId();
    const wrapperRef = useRef<HTMLSpanElement | null>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const redirectingFocus = useRef(false);
    const typeaheadTimer = useRef<number | undefined>(undefined);
    const typeahead = useRef("");
    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
      String(
        defaultValue ?? options.find((option) => !option.disabled)?.value ?? "",
      ),
    );
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const selectedValue =
      value === undefined ? uncontrolledValue : String(value ?? "");
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue,
    );

    const setSelectRef = useCallback(
      (node: HTMLSelectElement | null) => {
        selectRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    useEffect(() => () => window.clearTimeout(typeaheadTimer.current), []);

    const choose = (index: number) => {
      const option = options[index];
      if (!option || option.disabled || disabled) return;
      setUncontrolledValue(option.value);
      setActiveIndex(index);
      setOpen(false);
      if (selectRef.current) {
        selectRef.current.value = option.value;
        selectRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
      buttonRef.current?.focus();
    };

    const moveActive = (direction: 1 | -1) => {
      if (!options.length) return;
      let index = activeIndex;
      for (let count = 0; count < options.length; count += 1) {
        index = (index + direction + options.length) % options.length;
        if (!options[index].disabled) {
          setActiveIndex(index);
          return;
        }
      }
    };

    useEffect(() => {
      if (!open) return;
      const closeOnOutsideClick = (event: MouseEvent) => {
        if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", closeOnOutsideClick);
      return () =>
        document.removeEventListener("mousedown", closeOnOutsideClick);
    }, [open]);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setActiveIndex(
            selectedIndex >= 0
              ? selectedIndex
              : options.findIndex((option) => !option.disabled),
          );
          setOpen(true);
        } else {
          moveActive(event.key === "ArrowDown" ? 1 : -1);
        }
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const direction = event.key === "Home" ? 1 : -1;
        let index = event.key === "Home" ? 0 : options.length - 1;
        while (options[index]?.disabled && index >= 0 && index < options.length)
          index += direction;
        if (index >= 0 && index < options.length) {
          setActiveIndex(index);
          setOpen(true);
        }
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (open) choose(activeIndex);
        else {
          setActiveIndex(
            selectedIndex >= 0
              ? selectedIndex
              : options.findIndex((option) => !option.disabled),
          );
          setOpen(true);
        }
      } else if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      } else if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        typeahead.current += event.key.toLocaleLowerCase();
        window.clearTimeout(typeaheadTimer.current);
        typeaheadTimer.current = window.setTimeout(() => {
          typeahead.current = "";
        }, 500);
        const index = options.findIndex(
          (option) =>
            !option.disabled &&
            option.label.toLocaleLowerCase().startsWith(typeahead.current),
        );
        if (index >= 0) {
          setActiveIndex(index);
          setOpen(true);
        }
      }
    };

    return (
      <span ref={wrapperRef} className="relative block">
        <select
          {...selectProps}
          ref={setSelectRef}
          id={undefined}
          value={value}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
          onBlur={onBlur}
          onFocus={(event) => {
            if (
              document.activeElement !== buttonRef.current &&
              buttonRef.current
            ) {
              redirectingFocus.current = true;
              buttonRef.current.focus();
              redirectingFocus.current = false;
            }
            onFocus?.(event);
          }}
          className="pointer-events-none sr-only"
        >
          {children}
        </select>
        <button
          ref={buttonRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={
            open ? `${listId}-option-${activeIndex}` : undefined
          }
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={invalid || ariaInvalid || undefined}
          aria-required={required || undefined}
          name={selectProps.name}
          value={selectedValue}
          disabled={disabled}
          title={title}
          onBlur={() =>
            selectRef.current?.dispatchEvent(
              new FocusEvent("focusout", { bubbles: true }),
            )
          }
          onFocus={() => {
            if (!redirectingFocus.current) {
              selectRef.current?.dispatchEvent(
                new FocusEvent("focusin", { bubbles: true }),
              );
            }
          }}
          onKeyDown={handleKeyDown}
          onClick={() => {
            if (!disabled) {
              setActiveIndex(
                selectedIndex >= 0
                  ? selectedIndex
                  : options.findIndex((option) => !option.disabled),
              );
              setOpen((currentlyOpen) => !currentlyOpen);
            }
          }}
          className={cn(
            "relative flex h-11 w-full items-center justify-between rounded-xl border border-espresso-200 bg-white px-3.5 pr-10 text-left text-base text-espresso-900 shadow-sm transition sm:text-sm",
            "cursor-pointer focus:border-caramel-500 focus:outline-none focus:ring-2 focus:ring-caramel-500/20",
            "disabled:cursor-not-allowed disabled:bg-cream-50 disabled:text-espresso-300",
            invalid &&
              "border-berry-500 focus:border-berry-500 focus:ring-berry-500/20",
            className,
          )}
        >
          <span className="truncate">{selectedOption?.label ?? ""}</span>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-current"
            aria-hidden="true"
          />
        </button>
        {open && (
          <div
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1 h-60 w-full overflow-y-auto rounded-xl border border-espresso-200 bg-white p-1 shadow-lg"
          >
            {options.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={option.value === selectedValue}
                aria-disabled={option.disabled || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-espresso-900",
                  option.value === selectedValue && "bg-cream-50 font-medium",
                  index === activeIndex && "bg-cream-100",
                  option.disabled && "cursor-not-allowed text-espresso-300",
                )}
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {option.value === selectedValue && (
                    <Check className="h-4 w-4 text-caramel-700" />
                  )}
                </span>
                <span className="truncate">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </span>
    );
  },
);
