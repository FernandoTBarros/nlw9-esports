export function convertMinutesToHoursString(minutesAmount: number) {
	const hours = Math.floor(minutesAmount / 60).toString().padStart(2, '0');
	const minutes = String(minutesAmount % 60).padStart(2, '0');
	return `${hours}:${minutes}`;
}

export function convertHourStringToMinutes(hoursString: string) {
	const [hours, minutes] = hoursString.split(':').map(Number);

	return (hours * 60) + minutes;
}