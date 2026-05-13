interface Clinic {
    id: number;
    clinicName: string;
    regon?: string | null;
    nip?: string | null;
    street: string;
    houseNumber: string;
    apartmentNumber?: string | null;
    postalCode: string;
    city: string;
    country: string;
    workingHours?: string | null;
    phone?: string | null;
    email?: string | null;
    active: boolean;
    imageUrl?: string | null;
}

export default Clinic
