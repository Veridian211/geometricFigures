import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function wertGroesserGleichNullValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const wert = control.value;
		if (wert < 0) {
			return { wertGroesserGleichNull: true };
		}
		return null;
	};
}
