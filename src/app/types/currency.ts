export enum Currency {
		USD = "USD",
				EUR = "EUR",
				JPY = "JPY",
				GBP = "GBP",
				AUD = "AUD",
				CAD = "CAD",
				CHF = "CHF",
				CNY = "CNY",
				HKD = "HKD",
}


		export const CurrencyNames = {
				USD : "United States Dollar",
				EUR : "European Union Euro",
				JPY : "Japanese Yen",
				GBP : "Great British Pound",
				AUD : "Australian Dollar",
				CAD : "Canadian Dollar",
				CHF : "Swiss Franc",
				CNY : "Chinese Yuan",
				HKD : "Hong Kong Dollar",
		}

		export const CURRENCIES = ` ${Currency.USD}, ${Currency.EUR}, ${Currency.JPY}, ${Currency.GBP}, ${Currency.AUD}, ${Currency.CAD}, ${Currency.CHF}, ${Currency.CNY}, ${Currency.HKD}`

		export declare interface IExchange {
				From: Currency;
				To: Currency;
				Amount: number;
		}

		export declare interface IRate {
				base: Currency;
				currency:Currency;
				rate:number;
				amount?:number;
		}

