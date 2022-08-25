export const formatDate = (date: Date) => {
  const months = [
    { no: '01', name: 'Januari' },
    { no: '02', name: 'Februari' },
    { no: '03', name: 'Maret' },
    { no: '04', name: 'April' },
    { no: '05', name: 'Mei' },
    { no: '06', name: 'Juni' },
    { no: '07', name: 'Juli' },
    { no: '08', name: 'Agustus' },
    { no: '09', name: 'September' },
    { no: '10', name: 'Oktober' },
    { no: '11', name: 'November' },
    { no: '12', name: 'Desember' },
  ];
  const parsed_date = new Date(date);
  return `${parsed_date.getDate()} ${
    months[parsed_date.getMonth()].name
  } ${parsed_date.getFullYear()}`;
};

export const formatRupiah = (number = 0, show_currency = true) => {
  const formatted_number = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

  if (show_currency === false) return formatted_number.replace(/Rp /, '');
  return formatted_number;
};

export const indexPlusOne = (index: number) => {
  return index + 1;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
