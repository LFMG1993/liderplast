interface ColombiaData {
    id: number;
    departamento: string;
    ciudades: string[];
}

let cachedData: ColombiaData[] | null = null;

/**
 * Carga los datos de departamentos y ciudades de Colombia desde el archivo JSON.
 * Utiliza un caché en memoria para evitar recargas innecesarias.
 */
async function loadData(): Promise<ColombiaData[]> {
    if (cachedData) {
        return cachedData;
    }
    const response = await fetch('/colombia.json');
    const data: ColombiaData[] = await response.json();
    cachedData = data.sort((a, b) => a.departamento.localeCompare(b.departamento));
    return cachedData;
}

export const locationService = {
    getDepartments: async (): Promise<string[]> => {
        const data = await loadData();
        return data.map(d => d.departamento);
    },
    getCitiesByDepartment: async (departmentName: string): Promise<string[]> => {
        const data = await loadData();
        const department = data.find(d => d.departamento === departmentName);
        return department ? department.ciudades.sort((a, b) => a.localeCompare(b)) : [];
    },
};