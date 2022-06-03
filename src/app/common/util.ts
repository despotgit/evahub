import { variance, isNumeric } from "mathjs";
import { isNumber, isString, isNull, isUndefined } from "util";
import {
    euCountriesNames,
    iso2ToCountryNameList,
    reportingSubjects,
    relevantYears,
    naValueBackend,
    notComputableValueBackend,
    notCalculatedValueBackend,
    nkValueBackend,
    minusValueBackend,
    acceptedExtraneousNumericValues,
    thousandsDelimiter
} from "./constants";
import * as math from "mathjs";
import { DeletionResidualsService } from "../services/deletion-residuals.service";

// tslint:disable-next-line: no-namespace
export namespace util {
    export function unique(values: string[]) {
        const obj: { [k: string]: boolean } = {};
        values.forEach(v => (obj[v] = true));
        return Object.keys(obj);
    }

    export function isEmptyOrBlank(toCheck) {
        if (["", " ", "  "].indexOf(toCheck) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    export function formatNumber(asPercentage: boolean, n: number, d: number = 3) {
        if (asPercentage) {
            return formatAsPercentageRounded(n, d);
        } else {
            return roundAndThousandsDelimit(n, d, thousandsDelimiter);
        }
    }

    export function formatAsPercentageRounded(
        n: number,
        d: number = 2,
        delimitThousands = true,
        checkIfNotNumber = false,
        defaultValueIfNotNumber = "NA",
        delimiter: string = thousandsDelimiter
    ): string {
        if (checkIfNotNumber) {
            if (!n || !isNumber(n)) {
                return defaultValueIfNotNumber;
            }
        }
        let num = n * 100;

        if (delimitThousands) {
            return roundAndThousandsDelimit(num, d, delimiter) + "%";
        } else {
            return roundNumberTo(num, d) + "%";
        }
    }

    export function thousandsDelimit(n: number, delimiter: string = thousandsDelimiter) {
        if (n < 1000) {
            return n.toString();
        } else {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
        }
    }

    export function roundNumberTo(n: number, d = 3) {
        let ret;
        if (d === 0) {
            ret = Math.round(n);
        } else {
            ret = Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
        }

        return ret;
    }

    export function roundAndThousandsDelimit(n: number, d: number = 3, delimiter: string = thousandsDelimiter) {
        n = roundNumberTo(n, d);

        return thousandsDelimit(n, delimiter);
    }

    // Make a deep copy, non referenced to the original variable
    export function deepCopy(oldObj: any) {
        let newObj = oldObj;
        if (oldObj && typeof oldObj === "object") {
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (let i in oldObj) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    }

    export function getAverage(arr: number[]) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        let avg = sum / arr.length;
        return avg;
    }

    export function getVarianceForArray(a: number[]) {
        return variance(a);
    }

    export function getCovarianceBetweenTwoArrays(a: number[], b: number[]) {
        const avgA = this.getAverage(a);
        const avgB = this.getAverage(b);
        const maxLength = Math.max(a.length, b.length);

        let cov = 0;
        for (let i = 0; i < maxLength; i++) {
            cov += ((a[i] - avgA) * (b[i] - avgB)) / (maxLength - 1);
        }

        return cov;
    }

    /* 
    Function returns the projected (trend) value of function y,
    for given time serie, based on the sample data

    returns estimated value for y, for given trendX
    
    @moments - values for x
    @actualValues - values for y, will be truncated if needed, to be the same length as x array
    @trendX - value of y for the given x (trendX) of the new point in 2 dimensional space

    */
    export function getTrendProjection(moments: number[], givenValues: number[], trendX: number) {
        //console.log("actualValues are:");
        //console.log(givenValues);

        //console.log("moments is:");
        //console.log(moments);

        if (0 == moments.length) {
            return 0;
        }

        if (1 == moments.length) {
            return givenValues[0];
        }

        const actualValuesSized: number[] = [];
        for (let i = 0; i < moments.length; i++) {
            actualValuesSized[i] = givenValues[i];
        }

        const m =
            util.getCovarianceBetweenTwoArrays(moments, actualValuesSized) / this.getVarianceForArray(moments);
        const q = util.getAverage(actualValuesSized) - m * util.getAverage(moments);
        return m * trendX + q;
    }

    // Value of an element in an array, according to "Nearest rank" method of calculating an n-th percentile
    export function getPercentile(percentile: number, array: number[]) {
        //console.log();
        let orderedArray = util.deepCopy(array);
        orderedArray = orderedArray.sort((a, b) => a - b);

        //console.log("in percentile " + percentile + " function, ordered array is: ");
        //console.log(orderedArray);

        const nearestRankUnceiled = (percentile / 100) * array.length;
        //console.log("percentile unceiled is:");
        //console.log(percentileUnceiled);

        //console.log("percentile is:");
        //console.log(Math.ceil(percentileUnceiled));

        const nearestRankCeiled = Math.ceil(nearestRankUnceiled);

        return orderedArray[nearestRankCeiled];

        //console.log(percentile + "th percentile element is:" + );
    }

    // Transform array so that there are only numbers in it, throw out other things
    export function filterOutNonNumbersFromArray(a: number[]) {
        a = a.filter(v => {
            return isNumber(v) && !isNaN(v) && isFinite(v);
        });

        return a;
    }

    /*
    direction:
        0 - left to right (go through elements from left array, join them, if any, with right array, compare the two)
        1 - right to left (go through elements from right array, join them, if any, with left array, compare the two)
        2 - bi-directional (do 0 and 1)

    result:
        Array containing the elements - joint by the string s - that have different value for n for the joining key s.
        Can be empty, which would mean, the two arrays are exactly the same.
    */
    export function compareStringNumberPairsArrays(
        a1: { s: string; n: number }[] = [],
        a2: { s: string; n: number }[] = [],
        direction: number = 1,
        roundTo = 3
    ) {
        //console.log("a1 and a2 are:");
        //console.log(a1);
        //console.log(a2);

        let result = [];

        if (direction === 1) {
            a1.forEach(e1 => {
                //console.log("e1.s is:");
                //console.log(e1.s);

                const val1 = e1;

                const val2 = a2.find(e2 => {
                    //console.log("e2.s is:");
                    //console.log(e2.s);

                    return e1.s === e2.s;
                });

                //console.log("val2 is:");
                //console.log(val2);

                if (val2) {
                    if (roundNumberTo(val1.n, roundTo) !== roundNumberTo(val2.n, roundTo)) {
                        result.push({ key: e1.s, a1: val1, a2: val2 });
                    }
                }
            });
        }

        if (direction === 2) {
            Object.keys(a2).forEach(key => {
                if (roundNumberTo(a1[key], roundTo) !== roundNumberTo(a2[key], roundTo)) {
                    result.push({ a1: a1[key], a2: a2[key] });
                }
            });
        }

        if (direction === 3) {
            Object.keys(a1).forEach(key => {
                if (a1[key] !== a2[key]) {
                    result.push({ a1: a1[key], a2: a2[key] });
                }
            });

            Object.keys(a2).forEach(key => {
                if (roundNumberTo(a1[key], roundTo) !== roundNumberTo(a2[key], roundTo)) {
                    result.push({ a1: a1[key], a2: a2[key] });
                }
            });
        }

        return result;
    }

    export function isValidXlsxColumnName(n: string) {
        //console.log("in isValidXlsxColumnName, n is:");
        //console.log(n);

        if (n === "" || !n || n.length > 2 || n.length === 0) {
            return false;
        }

        let firstLetter = n.substr(0, 1).toLowerCase();

        if (
            [
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z"
            ].indexOf(firstLetter) === -1
        ) {
            return false;
        }

        if (n.length === 2) {
            let secondLetter = n.substr(1, 1).toLowerCase();

            if (
                [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z"
                ].indexOf(secondLetter) === -1
            ) {
                return false;
            }
        }

        return true;
    }

    export function isValidInteger(value: any) {
        //console.log("value is:");
        //console.log(value);

        //console.log("parsato e':");
        //console.log(parseInt(value, 10));

        return value === parseInt(value, 10).toString();
    }

    export function isValidNumber(value: any, log = false) {
        if (log) {
            console.log("value is:");
            console.log(value);
        }

        //console.log("parsato e':");
        //console.log(parseInt(value, 10));

        const numberRegex = new RegExp("^-?[0-9]*[.]?[0-9]+$");

        let toreturn = numberRegex.test(value);

        if (log) {
            console.log("toreturn is:");
            console.log(toreturn);
        }

        return toreturn;
    }

    export function getXlsxColumnIndexFromColumnName(column: string) {
        switch (column.toLowerCase()) {
            case "a":
                return 0;
            case "b":
                return 1;
            case "c":
                return 2;
            case "d":
                return 3;
            case "e":
                return 4;
            case "f":
                return 5;
            case "g":
                return 6;
            case "h":
                return 7;
            case "i":
                return 8;
            case "j":
                return 9;
            case "k":
                return 10;
            case "l":
                return 11;
            case "m":
                return 12;
            case "n":
                return 13;
            case "o":
                return 14;
            case "p":
                return 15;
            case "q":
                return 16;
            case "r":
                return 17;
            case "s":
                return 18;
            case "t":
                return 19;
            case "u":
                return 20;
            case "v":
                return 21;
            case "w":
                return 22;
            case "x":
                return 23;
            case "y":
                return 24;
            case "z":
                return 25;
            case "aa":
                return 26;
            case "ab":
                return 27;
            case "ac":
                return 28;
            case "ad":
                return 29;
            case "ae":
                return 30;
            case "af":
                return 31;
            case "ag":
                return 32;
            case "ah":
                return 33;
            case "ai":
                return 34;
            case "aj":
                return 35;
            case "ak":
                return 36;
            case "al":
                return 37;
            case "am":
                return 38;
            case "an":
                return 39;
            case "ao":
                return 40;
            case "ap":
                return 41;
            case "aq":
                return 42;
            case "ar":
                return 43;
            case "as":
                return 44;
            case "at":
                return 45;
        }
    }

    export function isValidCountryCode(cc: string) {
        let allIso2 = Object.keys(iso2ToCountryNameList);

        if (allIso2.indexOf(cc) === -1) {
            return false;
        } else {
            return true;
        }
    }

    export function isValidReportingSubjectCode(cc: string) {
        let allObjects = Object.keys(reportingSubjects);

        if (allObjects.indexOf(cc) === -1) {
            return false;
        } else {
            return true;
        }
    }

    // Returns the results of calculation of the deletion residuals
    export async function calculateDeletionResidualsStatistics(
        population: number = 5,
        series: any[] = [],
        deletionResidualsService: DeletionResidualsService // Function needs an async service to get the residuals statistics from
    ) {
        // ****************************************************************** result variables:

        let years: number[] = [];
        let ss: number[] = [];
        let drs: number[] = [];
        let pvals: any[] = [];
        let capitalRSquared: number = null;
        let res: number[] = [];

        // ****************************************************************** passi 1-5:

        //console.log("series is:");
        //console.log(series);

        if (
            series.some(s => {
                return isNaN(+s);
            })
        ) {
            pvals = ["NA", "NA", "NA", "NA", "NA"];
            return { years, ss, drs, pvals, capitalRSquared, res };
        }

        let n = population;

        let ar = [];

        for (let i = 1; i <= n; i++) {
            ar.push([1, i]);
        }

        let x = math.matrix(ar);

        let xTransposed = math.transpose(x);

        let xTransposedTimesX = math.multiply(xTransposed, x);

        let xTransposedTimesXProductInversed = math.inv(xTransposedTimesX);

        let finalProductMatrix = math.multiply(math.multiply(x, xTransposedTimesXProductInversed), xTransposed);

        let h = math.diag(finalProductMatrix);
        let hArray = h.valueOf();

        // ****************************************************************** passi A, B, C:

        let y = math.matrix(series);
        let yArray: any = y.valueOf();

        //console.log("yArray is:");
        //console.log(yArray);

        let yMean;
        try {
            yMean = math.mean(yArray);
        } catch (e) {
            return this.formAndReturnEmptyResultForDeletionResiduals();
        }
        //console.log("yMean is:");
        //console.log(yMean);

        let xTransposedTimesY = math.multiply(xTransposed, y);

        let b = math.multiply(xTransposedTimesXProductInversed, xTransposedTimesY);

        let yEstimated = math.multiply(x, b);
        let yEstimatedArray: any = yEstimated.valueOf();
        //console.log("y estimated is:");
        //console.log(yEstimatedArray);

        let r = math.subtract(y, yEstimated);
        //console.log("r is:");
        //console.log(r.valueOf());

        let rArray = r.valueOf();

        let sumSmallRsSquared = 0;
        for (let i = 0; i < n; i++) {
            sumSmallRsSquared += math.square(rArray[i]);
        }

        //console.log("sumRSquared is:");
        //console.log(sumSmallRsSquared);

        // ****************************************************************** passo LOOP:

        let sumNumerator = 0;
        let sumDenominator = 0;

        for (let i = 0; i < n; i++) {
            years.push(relevantYears[i]);

            ss[i] = (sumSmallRsSquared - math.square(r.valueOf()[i]) / (1 - hArray[i])) / (n - 3);

            drs[i] = rArray[i] / math.sqrt(ss[i] * (1 - hArray[i]));

            res[i] = yArray[i] - yMean;
            sumNumerator += math.square(yEstimatedArray[i] - yArray[i]);
            sumDenominator += math.square(res[i]);
        }

        let absDrs = [];

        for (let i = 0; i < n; i++) {
            absDrs.push(math.abs(drs[i]));
        }

        for (let i = 0; i < n; i++) {
            if (isNaN(absDrs[i]) || Infinity == absDrs[i]) {
                return this.formAndReturnEmptyResultForDeletionResiduals();
            }
        }

        let cdfs = undefined;
        //console.log("cdfs is!!!!:");
        //console.log(cdfs);

        let tries = 0;
        // Check if failed because of DB - in which case - retry
        while (isUndefined(cdfs) && tries < 20) {
            //console.log("retrying due to failed DB query of cdf()");

            tries++;
            cdfs = await deletionResidualsService
                .getCdfs(absDrs, n - 2)
                .toPromise()
                .catch(err => {
                    console.log("error is:");
                    console.log(err);
                });
        }

        //console.log("cdfs are:");
        //console.log(cdfs);

        // Check if uncalculable case
        if (isNull(cdfs) || isUndefined(cdfs)) {
            return this.formAndReturnEmptyResultForDeletionResiduals();
        }

        for (let i = 0; i < n; i++) {
            pvals[i] = 2 * (1 - +cdfs["cdf" + i]);
        }

        capitalRSquared = 1 - sumNumerator / sumDenominator;

        //console.log("sumNumerator is:");
        //console.log(sumNumerator);

        //console.log("sumDenominator is:");
        //console.log(sumDenominator);

        //console.log("res is:");
        //console.log(res);

        //console.log("capitalRSquared is:");
        //console.log(capitalRSquared);

        //console.log("pvals is:");
        //console.log(pvals);

        return { years, ss, drs, pvals, capitalRSquared, res };
    }

    export function formAndReturnEmptyResultForDeletionResiduals() {
        //console.log("in formAndReturnEmptyResultForDeletionResiduals");

        let years = [];
        let ss = [];
        let drs = [];
        let pvals = [];
        let capitalRSquared = null;
        let res = [];

        return { years, ss, drs, pvals, capitalRSquared, res };
    }

    export function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    export function isValidComputedValue(v) {
        if (isValidNumber(v) || [notComputableValueBackend, notCalculatedValueBackend].indexOf(v) != -1) {
            return true;
        } else {
            return false;
        }
    }

    // See if the value is a number or is an extr-a-neous displayable acceptable numeric value
    export function isDisplayableRawNumericValue(v) {
        return isValidNumber(v) || isAcceptedExtraneousNumericValue(v);
    }

    // See if the value is an extraneous displayable acceptable quasi-numeric value
    export function isAcceptedExtraneousNumericValue(v) {
        if (acceptedExtraneousNumericValues.indexOf(v) !== -1) {
            return true;
        } else {
            return false;
        }
    }
}
