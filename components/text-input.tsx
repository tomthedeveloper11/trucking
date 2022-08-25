interface TextInputConfig {
  prefix?: string;
  label?: string;
  name: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  type?: string;
}

export default function TextInput({
  prefix,
  name,
  label,
  placeholder,
  onChange,
  value,
  type = 'text',
}: TextInputConfig) {
  const valueFormat = (inputValue: any) => {
    if (type === 'currency') {
      const str = inputValue.toString().replace(/[A-Za-z,\-\_\+\=]/g, '');
      return Number(str).toLocaleString();
    }
    return inputValue as string;
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === 'currency') {
      e.target.value = e.target.value
        .toString()
        .replace(/[A-Za-z,\-\_\+\=]/g, '');
    }
    onChange(e);
  }

  return (
    <>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm"> {prefix} </span>
          </div>
          <input
            type={type}
            name={name}
            // id="price"
            className={
              type == 'currency'
                ? 'block w-full pl-8 pr-2 py-1 sm:text-sm border border-gray-300 rounded-md'
                : 'block w-full pl-4 pr-2 py-1 sm:text-sm border border-gray-300 rounded-md'
            }
            placeholder={placeholder}
            onChange={handleChange}
            value={valueFormat(value)}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>

            {/* <select
              id="currency"
              name="currency"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
            >
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </select> */}
          </div>
        </div>
      </div>
    </>
  );
}
