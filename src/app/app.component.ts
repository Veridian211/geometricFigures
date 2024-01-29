import { ChangeDetectorRef, Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatRadioChange, MatRadioModule } from "@angular/material/radio";
import {
	BerechnungsGroesse,
	BerechnungsGroessen,
	Form,
	Formen,
} from "./app.constant";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { wertGroesserGleichNullValidator } from "./eingabe.validators";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		MatRadioModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.sass",
})
export class AppComponent {
	constructor(private ref: ChangeDetectorRef) {}

	title = "Geometrische Figuren";
	Formen = Formen;
	Form = Form;
	BerechnungsGroesse = BerechnungsGroesse;

	geometrischeFormen = Formen;
	ausgewaehlteForm = signal(Formen[0]);

	berechnungsGroessen = BerechnungsGroessen;
	ausgewaehlteBerechnungsGroesse = signal(BerechnungsGroessen[0]);

	a = 0;
	b = 0;
	c = 0;
	r = 0;
	umfang = 0;
	flaecheninhalt = 0;

	groessenEingabeForm = new FormGroup({
		wertA: new FormControl("", [
			Validators.required,
			wertGroesserGleichNullValidator(),
		]),
		wertB: new FormControl("", [
			Validators.required,
			wertGroesserGleichNullValidator(),
		]),
		wertC: new FormControl("", [
			Validators.required,
			wertGroesserGleichNullValidator(),
		]),
		wertR: new FormControl("", [
			Validators.required,
			wertGroesserGleichNullValidator(),
		]),
	});

	berechnen() {
		this.umfang = this.berechneUmfang();
		this.flaecheninhalt = this.berechneFlaecheninhalt();
	}

	berechneUmfang() {
		switch (this.ausgewaehlteForm()) {
			case Form.RECHTECK:
				if (!this.istValidesRechteck()) {
					return 0;
				}
				return 2 * (this.a + this.b);
			case Form.DREIECK:
				if (!this.istValidesDreieck()) {
					return 0;
				}
				return this.a + this.b + this.c;
			case Form.KREIS:
				if (!this.istValiderKreis()) {
					return 0;
				}
				return 2 * Math.PI * this.r;
			default:
				return 0;
		}
	}

	berechneFlaecheninhalt() {
		switch (this.ausgewaehlteForm()) {
			case Form.RECHTECK:
				if (!this.istValidesRechteck()) {
					return 0;
				}
				return this.a * this.b;
			case Form.DREIECK: {
				if (!this.istValidesDreieck()) {
					return 0;
				}
				const s = (this.a + this.b + this.c) / 2;
				return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
			}
			case Form.KREIS:
				if (!this.istValiderKreis()) {
					return 0;
				}
				return Math.PI * this.r ** 2;
			default:
				return 0;
		}
	}

	formGeaendert(event: MatRadioChange) {
		this.ausgewaehlteForm.set(event.value);
		this.eingabenLoeschen();
	}

	berechnungsGroesseGeaendert(event: MatRadioChange) {
		this.ausgewaehlteBerechnungsGroesse.set(event.value);
		this.berechnen();
	}

	istValidesDreieck() {
		return (
			this.a > 0 &&
			this.b > 0 &&
			this.c > 0 &&
			this.a + this.b > this.c &&
			this.a + this.c > this.b &&
			this.b + this.c > this.a
		);
	}

	istValidesRechteck() {
		return this.a > 0 && this.b > 0;
	}

	istValiderKreis() {
		console.log(this.r);
		return this.r > 0;
	}

	dreieckSeitenSindEingegeben() {
		console.log(this.a, this.b, this.c);
		return this.a > 0 && this.b > 0 && this.c > 0;
	}

	berechnungsFormel = computed(() => {
		if (
			this.ausgewaehlteForm() === Form.RECHTECK &&
			this.ausgewaehlteBerechnungsGroesse() === BerechnungsGroesse.UMFANG
		) {
			return "U = 2 * a + 2 * b";
		}
		if (
			this.ausgewaehlteForm() === Form.RECHTECK &&
			this.ausgewaehlteBerechnungsGroesse() === BerechnungsGroesse.FLAECHE
		) {
			return "A = a * b";
		}
		if (
			this.ausgewaehlteForm() === Form.DREIECK &&
			this.ausgewaehlteBerechnungsGroesse() === BerechnungsGroesse.UMFANG
		) {
			return "U = a + b + c";
		}
		if (
			this.ausgewaehlteForm() === Form.DREIECK &&
			this.ausgewaehlteBerechnungsGroesse() === BerechnungsGroesse.FLAECHE
		) {
			return "A = sqrt(s * (s - a) * (s - b) * (s - c))<br>s = (a + b + c) / 2";
		}
		if (
			this.ausgewaehlteForm() === Form.KREIS &&
			this.ausgewaehlteBerechnungsGroesse() === BerechnungsGroesse.UMFANG
		) {
			return "U = 2 * pi * r";
		}
		if (
			this.ausgewaehlteForm() === Form.KREIS &&
			this.ausgewaehlteBerechnungsGroesse() === BerechnungsGroesse.FLAECHE
		) {
			return "A = pi * r^2";
		}
		return "";
	});

	eingabenLoeschen() {
		this.a = 0;
		this.b = 0;
		this.c = 0;
		this.r = 0;
		this.umfang = 0;
		this.flaecheninhalt = 0;
		this.ref.detectChanges();
	}
}
