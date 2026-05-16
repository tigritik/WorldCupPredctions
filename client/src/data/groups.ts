export type Team = {
    id: string;
    name: string;
    code: string;
};

export type Group = {
    name: string;
    teams: Team[];
};

export const groups: Group[] = [
    {
        name: "A",
        teams: [
            { id: "A-MEX", name: "Mexico", code: "MEX" },
            { id: "A-KOR", name: "South Korea", code: "KOR" },
            { id: "A-RSA", name: "South Africa", code: "RSA" },
            { id: "A-CZE", name: "Czechia", code: "CZE" }
        ]
    },
    {
        name: "B",
        teams: [
            { id: "B-CAN", name: "Canada", code: "CAN" },
            { id: "B-SUI", name: "Switzerland", code: "SUI" },
            { id: "B-QAT", name: "Qatar", code: "QAT" },
            { id: "B-BIH", name: "Bosnia and Herzegovina", code: "BIH" }
        ]
    },
    {
        name: "C",
        teams: [
            { id: "C-BRA", name: "Brazil", code: "BRA" },
            { id: "C-MAR", name: "Morocco", code: "MAR" },
            { id: "C-SCO", name: "Scotland", code: "SCO" },
            { id: "C-HAI", name: "Haiti", code: "HAI" }
        ]
    },
    {
        name: "D",
        teams: [
            { id: "D-USA", name: "United States", code: "USA" },
            { id: "D-AUS", name: "Australia", code: "AUS" },
            { id: "D-PAR", name: "Paraguay", code: "PAR" },
            { id: "D-TUR", name: "Türkiye", code: "TUR" }
        ]
    },
    {
        name: "E",
        teams: [
            { id: "E1", name: "Germany", code: "GER" },
            { id: "E2", name: "Curaçao", code: "CUW" },
            { id: "E3", name: "Ivory Coast", code: "CIV" },
            { id: "E4", name: "Ecuador", code: "ECU" }
        ]
    },
    {
        name: "F",
        teams: [
            { id: "F1", name: "Netherlands", code: "NED" },
            { id: "F2", name: "Japan", code: "JPN" },
            { id: "F3", name: "Sweden", code: "SWE" },
            { id: "F4", name: "Tunisia", code: "TUN" }
        ]
    },
    {
        name: "G",
        teams: [
            { id: "G1", name: "Belgium", code: "BEL" },
            { id: "G2", name: "Egypt", code: "EGY" },
            { id: "G3", name: "Iran", code: "IRN" },
            { id: "G4", name: "New Zealand", code: "NZL" }
        ]
    },
    {
        name: "H",
        teams: [
            { id: "H1", name: "Spain", code: "ESP" },
            { id: "H2", name: "Cape Verde", code: "CPV" },
            { id: "H3", name: "Saudi Arabia", code: "KSA" },
            { id: "H4", name: "Uruguay", code: "URU" }
        ]
    },
    {
        name: "I",
        teams: [
            { id: "I1", name: "France", code: "FRA" },
            { id: "I2", name: "Senegal", code: "SEN" },
            { id: "I3", name: "Iraq", code: "IRQ" },
            { id: "I4", name: "Norway", code: "NOR" }
        ]
    },
    {
        name: "J",
        teams: [
            { id: "J1", name: "Argentina", code: "ARG" },
            { id: "J2", name: "Algeria", code: "ALG" },
            { id: "J3", name: "Austria", code: "AUT" },
            { id: "J4", name: "Jordan", code: "JOR" }
        ]
    },
    {
        name: "K",
        teams: [
            { id: "K1", name: "Portugal", code: "POR" },
            { id: "K2", name: "DR Congo", code: "COD" },
            { id: "K3", name: "Uzbekistan", code: "UZB" },
            { id: "K4", name: "Colombia", code: "COL" }
        ]
    },
    {
        name: "L",
        teams: [
            { id: "L1", name: "England", code: "ENG" },
            { id: "L2", name: "Croatia", code: "CRO" },
            { id: "L3", name: "Ghana", code: "GHA" },
            { id: "L4", name: "Panama", code: "PAN" }
        ]
    }
];

export const getFlagUrl = (code: string) =>
    `https://api.fifa.com/api/v3/picture/flags-sq-2/${code}`;
