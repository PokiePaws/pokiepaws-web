export interface Clinic {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    image: string;
    description: string;
    rating: number;
}

export interface Diagnosis {
    code: string;
    name: string;
}

export interface Medicine {
    id: string;
    name: string;
    unit: string;
}

export interface LabTest {
    id: string;
    name: string;
}

export interface Veterinarian {
    id: string;
    name: string;
    specialization: string;
    clinicId: string;
    image: string;
    bio: string;}

export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
}

export const mockClinics: Clinic[] = [
    {
        id: 'c1',
        name: 'PokiePaws Central',
        city: 'Warsaw',
        address: 'ul. Marszałkowska 10, 00-001 Warszawa',
        phone: '+48 22 123 45 67',
        image: '/WWA.jpg',
        description: 'Our flagship clinic in the heart of Warsaw, equipped with the latest diagnostic tools.',
        rating: 4.9
    },
    {
        id: 'c2',
        name: 'PokiePaws West',
        city: 'Wrocław',
        address: 'ul. Grunwaldzka 50, 80-001 Wrocław',
        phone: '+48 58 321 45 67',
        image: '/WRO.jpg',
        description: 'Specializing in marine animal care and general veterinary services.',
        rating: 4.7
    },
    {
        id: 'c3',
        name: 'PokiePaws South',
        city: 'Kraków',
        address: 'ul. Floriańska 15, 31-001 Kraków',
        phone: '+48 12 456 78 90',
        image: '/KRK.jpg',
        description: 'A cozy clinic with a long tradition of caring for local pets.',
        rating: 4.8
    }
];

export const mockDiagnoses: Diagnosis[] = [
    { code: 'A00.0', name: 'Cholera due to Vibrio cholerae 01, biovar cholerae' },
    { code: 'B01.9', name: 'Varicella without complication' },
    { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified' },
    { code: 'K29.7', name: 'Gastritis, unspecified' },
    { code: 'M54.5', name: 'Low back pain' },
    { code: 'S06.0', name: 'Concussion' },
    { code: 'VET-001', name: 'Canine Parvovirus' },
    { code: 'VET-002', name: 'Feline Leukemia Virus (FeLV)' },
    { code: 'VET-003', name: 'Otitis Externa' },
    { code: 'VET-004', name: 'Dental Calculus' }
];

export const mockMedicines: Medicine[] = [
    { id: 'm1', name: 'Amoxicillin', unit: 'mg' },
    { id: 'm2', name: 'Carprofen', unit: 'mg' },
    { id: 'm3', name: 'Meloxicam', unit: 'ml' },
    { id: 'm4', name: 'Prednisone', unit: 'mg' },
    { id: 'm5', name: 'Fipronil', unit: 'pipette' }
];

export const mockLabTests: LabTest[] = [
    { id: 't1', name: 'Complete Blood Count (CBC)' },
    { id: 't2', name: 'Biochemistry Panel' },
    { id: 't3', name: 'Urinalysis' },
    { id: 't4', name: 'Fecal Exam' },
    { id: 't5', name: 'X-Ray' }
];

export const mockVets: Veterinarian[] = [
    {
        id: 'v1',
        name: 'Dr. Anna Kowalska',
        specialization: 'Chirurg (Surgeon)',
        clinicId: 'c1',
        image: 'https://picsum.photos/seed/vet1/400/400',
        bio: 'Specialist in soft tissue and orthopedic surgery.'
    },
    {
        id: 'v2',
        name: 'Dr. Marek Nowak',
        specialization: 'Kardiolog (Cardiologist)',
        clinicId: 'c1',
        image: 'https://picsum.photos/seed/vet2/400/400',
        bio: 'Expert in heart diseases and echocardiography.'
    },
    {
        id: 'v3',
        name: 'Dr. Ewa Wiśniewska',
        specialization: 'Dermatolog (Dermatologist)',
        clinicId: 'c1',
        image: 'https://picsum.photos/seed/vet3/400/400',
        bio: 'Focuses on skin allergies and chronic conditions.'
    },
    {
        id: 'v4',
        name: 'Dr. Piotr Zieliński',
        specialization: 'Neurolog (Neurologist)',
        clinicId: 'c2',
        image: 'https://picsum.photos/seed/vet4/400/400',
        bio: 'Specializes in spinal injuries and brain disorders.'
    },
    {
        id: 'v5',
        name: 'Dr. Maria Lewandowska',
        specialization: 'Onkolog (Oncologist)',
        clinicId: 'c2',
        image: 'https://picsum.photos/seed/vet5/400/400',
        bio: 'Dedicated to cancer treatment and chemotherapy.'
    },
    {
        id: 'v6',
        name: 'Dr. Jan Wójcik',
        specialization: 'Okulista (Ophthalmologist)',
        clinicId: 'c2',
        image: 'https://picsum.photos/seed/vet6/400/400',
        bio: 'Expert in eye surgeries and vision care.'
    },
    {
        id: 'v7',
        name: 'Dr. Katarzyna Mazur',
        specialization: 'Radiolog (Radiologist)',
        clinicId: 'c3',
        image: 'https://picsum.photos/seed/vet7/400/400',
        bio: 'Specialist in advanced imaging (CT, MRI, X-Ray).'
    },
    {
        id: 'v8',
        name: 'Dr. Tomasz Kaczmarek',
        specialization: 'Stomatolog (Dentist)',
        clinicId: 'c3',
        image: 'https://picsum.photos/seed/vet8/400/400',
        bio: 'Focuses on oral hygiene and dental surgeries.'
    },
    {
        id: 'v9',
        name: 'Dr. Agnieszka Zając',
        specialization: 'Lekarz ratunkowy (Emergency Care)',
        clinicId: 'c3',
        image: 'https://picsum.photos/seed/vet9/400/400',
        bio: 'Specialist in critical care and emergency medicine.'
    },
];

export const mockBlog : Blog [] = [
    {
        id: '1',
        title: 'How to Keep Your Pet Cool in Summer',
        excerpt: 'Summer heat can be dangerous for pets. Learn how to prevent heatstroke and keep your furry friends comfortable.',
        author: 'Dr. Sarah Smith',
        date: 'May 10, 2024',
        category: 'Pet Care',
        image: 'https://picsum.photos/seed/summer-pet/800/600',
    }
];
export const mockPrescriptions = [];
export const mockLabOrders = [];
export const mockSupplyOrders = [];
