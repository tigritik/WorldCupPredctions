import type { Match } from "@shared//types";

export const matches: Match[] = [
    // Group A
    { matchNum: 1, group: "A", teamIds: ["A1", "A2"] }, // Mexico vs South Africa
    { matchNum: 2, group: "A", teamIds: ["A3", "A4"] }, // South Korea vs Czechia
    { matchNum: 25, group: "A", teamIds: ["A4", "A2"] }, // Czechia vs South Africa
    { matchNum: 28, group: "A", teamIds: ["A1", "A3"] }, // Mexico vs South Korea
    { matchNum: 53, group: "A", teamIds: ["A4", "A1"] }, // Czechia vs Mexico
    { matchNum: 54, group: "A", teamIds: ["A2", "A3"] }, // South Africa vs South Korea

    // Group B
    { matchNum: 3, group: "B", teamIds: ["B1", "B2"] }, // Canada vs Bosnia and Herzegovina
    { matchNum: 8, group: "B", teamIds: ["B3", "B4"] }, // Qatar vs Switzerland
    { matchNum: 26, group: "B", teamIds: ["B4", "B2"] }, // Switzerland vs Bosnia and Herzegovina
    { matchNum: 27, group: "B", teamIds: ["B1", "B3"] }, // Canada vs Qatar
    { matchNum: 51, group: "B", teamIds: ["B4", "B1"] }, // Switzerland vs Canada
    { matchNum: 52, group: "B", teamIds: ["B2", "B3"] }, // Bosnia and Herzegovina vs Qatar

    // Group C
    { matchNum: 7, group: "C", teamIds: ["C1", "C2"] }, // Brazil vs Morocco
    { matchNum: 5, group: "C", teamIds: ["C3", "C4"] }, // Haiti vs Scotland
    { matchNum: 30, group: "C", teamIds: ["C4", "C2"] }, // Scotland vs Morocco
    { matchNum: 29, group: "C", teamIds: ["C1", "C3"] }, // Brazil vs Haiti
    { matchNum: 49, group: "C", teamIds: ["C4", "C1"] }, // Scotland vs Brazil
    { matchNum: 50, group: "C", teamIds: ["C2", "C3"] }, // Morocco vs Haiti

    // Group D
    { matchNum: 4, group: "D", teamIds: ["D1", "D2"] }, // USA vs Paraguay
    { matchNum: 6, group: "D", teamIds: ["D3", "D4"] }, // Australia vs Türkiye
    { matchNum: 32, group: "D", teamIds: ["D1", "D3"] }, // USA vs Australia
    { matchNum: 31, group: "D", teamIds: ["D4", "D2"] }, // Türkiye vs Paraguay
    { matchNum: 59, group: "D", teamIds: ["D4", "D1"] }, // Türkiye vs USA
    { matchNum: 60, group: "D", teamIds: ["D2", "D3"] }, // Paraguay vs Australia

    // Group E
    { matchNum: 10, group: "E", teamIds: ["E1", "E2"] }, // Germany vs Curaçao
    { matchNum: 9, group: "E", teamIds: ["E3", "E4"] }, // Ivory Coast vs Ecuador
    { matchNum: 33, group: "E", teamIds: ["E1", "E3"] }, // Germany vs Ivory Coast
    { matchNum: 34, group: "E", teamIds: ["E4", "E2"] }, // Ecuador vs Curaçao
    { matchNum: 55, group: "E", teamIds: ["E2", "E3"] }, // Curaçao vs Ivory Coast
    { matchNum: 56, group: "E", teamIds: ["E4", "E1"] }, // Ecuador vs Germany

    // Group F
    { matchNum: 11, group: "F", teamIds: ["F1", "F2"] }, // Netherlands vs Japan
    { matchNum: 12, group: "F", teamIds: ["F3", "F4"] }, // Sweden vs Tunisia
    { matchNum: 35, group: "F", teamIds: ["F1", "F3"] }, // Netherlands vs Sweden
    { matchNum: 36, group: "F", teamIds: ["F4", "F2"] }, // Tunisia vs Japan
    { matchNum: 57, group: "F", teamIds: ["F2", "F3"] }, // Japan vs Sweden
    { matchNum: 58, group: "F", teamIds: ["F4", "F1"] }, // Tunisia vs Netherlands

    // Group G
    { matchNum: 16, group: "G", teamIds: ["G1", "G2"] }, // Belgium vs Egypt
    { matchNum: 15, group: "G", teamIds: ["G3", "G4"] }, // Iran vs New Zealand
    { matchNum: 39, group: "G", teamIds: ["G1", "G3"] }, // Belgium vs Iran
    { matchNum: 40, group: "G", teamIds: ["G4", "G2"] }, // New Zealand vs Egypt
    { matchNum: 63, group: "G", teamIds: ["G2", "G3"] }, // Egypt vs Iran
    { matchNum: 64, group: "G", teamIds: ["G4", "G1"] }, // New Zealand vs Belgium

    // Group H
    { matchNum: 14, group: "H", teamIds: ["H1", "H2"] }, // Spain vs Cape Verde
    { matchNum: 13, group: "H", teamIds: ["H3", "H4"] }, // Saudi Arabia vs Uruguay
    { matchNum: 38, group: "H", teamIds: ["H1", "H3"] }, // Spain vs Saudi Arabia
    { matchNum: 37, group: "H", teamIds: ["H4", "H2"] }, // Uruguay vs Cape Verde
    { matchNum: 65, group: "H", teamIds: ["H2", "H3"] }, // Cape Verde vs Saudi Arabia
    { matchNum: 66, group: "H", teamIds: ["H4", "H1"] }, // Uruguay vs Spain

    // Group I
    { matchNum: 17, group: "I", teamIds: ["I1", "I2"] }, // France vs Senegal
    { matchNum: 18, group: "I", teamIds: ["I3", "I4"] }, // Iraq vs Norway
    { matchNum: 42, group: "I", teamIds: ["I1", "I3"] }, // France vs Iraq
    { matchNum: 41, group: "I", teamIds: ["I4", "I2"] }, // Norway vs Senegal
    { matchNum: 61, group: "I", teamIds: ["I4", "I1"] }, // Norway vs France
    { matchNum: 62, group: "I", teamIds: ["I2", "I3"] }, // Senegal vs Iraq

    // Group J
    { matchNum: 19, group: "J", teamIds: ["J1", "J2"] }, // Argentina vs Algeria
    { matchNum: 20, group: "J", teamIds: ["J3", "J4"] }, // Austria vs Jordan
    { matchNum: 43, group: "J", teamIds: ["J1", "J3"] }, // Argentina vs Austria
    { matchNum: 44, group: "J", teamIds: ["J4", "J2"] }, // Jordan vs Algeria
    { matchNum: 69, group: "J", teamIds: ["J2", "J3"] }, // Algeria vs Austria
    { matchNum: 70, group: "J", teamIds: ["J4", "J1"] }, // Jordan vs Argentina

    // Group K
    { matchNum: 23, group: "K", teamIds: ["K1", "K2"] }, // Portugal vs DR Congo
    { matchNum: 24, group: "K", teamIds: ["K3", "K4"] }, // Uzbekistan vs Colombia
    { matchNum: 47, group: "K", teamIds: ["K1", "K3"] }, // Portugal vs Uzbekistan
    { matchNum: 48, group: "K", teamIds: ["K4", "K2"] }, // Colombia vs DR Congo
    { matchNum: 71, group: "K", teamIds: ["K4", "K1"] }, // Colombia vs Portugal
    { matchNum: 72, group: "K", teamIds: ["K2", "K3"] }, // DR Congo vs Uzbekistan

    // Group L
    { matchNum: 22, group: "L", teamIds: ["L1", "L2"] }, // England vs Croatia
    { matchNum: 21, group: "L", teamIds: ["L3", "L4"] }, // Ghana vs Panama
    { matchNum: 45, group: "L", teamIds: ["L1", "L3"] }, // England vs Ghana
    { matchNum: 46, group: "L", teamIds: ["L4", "L2"] }, // Panama vs Croatia
    { matchNum: 67, group: "L", teamIds: ["L4", "L1"] }, // Panama vs England
    { matchNum: 68, group: "L", teamIds: ["L2", "L3"] }, // Croatia vs Ghana
];
