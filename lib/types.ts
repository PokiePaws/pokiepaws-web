interface Clinic {
    id: number;
    clinicName: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    postalCode: string;
    city: string;
    country: string;
    workingHours?: string;
    phone?: string;
    email?: string;
    active: boolean;
    imageUrl?: string;
}

export default Clinic