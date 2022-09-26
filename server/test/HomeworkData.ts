export default interface Matiere {
    entityCode: string;
    entityLibelle: string;
    entityType: string;
    matiere: string;
    codeMatiere: string;
    nomProf: string;
    id: number;
    interrogation: boolean;
    blogActif: boolean;
    nbJourMaxRenduDevoir: number;
    contenuDeSeance: MatiereContenuDeSeance;
    aFaire?: AFaire;
}

export interface AFaire {
    idDevoir: number;
    contenu: string;
    rendreEnLigne: boolean;
    donneLe: Date;
    effectue: boolean;
    ressource: string;
    ressourceDocuments: any[];
    documents: Document[];
    elementsProg: any[];
    liensManuel: any[];
    documentsRendus: any[];
    contenuDeSeance: AFaireContenuDeSeance;
}

export interface AFaireContenuDeSeance {
    contenu: string;
    documents: Document[];
}

export interface Document {
    id: number;
    libelle: string;
    date: string;
    taille: number;
    type: string;
    signatureDemandee: boolean;
    signature: Signature;
}

export interface Signature {
}

export interface MatiereContenuDeSeance {
    idDevoir: number;
    contenu: string;
    documents: any[];
    elementsProg: any[];
    liensManuel: any[];
}
