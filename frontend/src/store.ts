import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { error } from "console";


const BASE = 'http://localhost:5000/api';



export const getDoctors = createAsyncThunk('app/getDoctors',
    async (params: {
        name?: string;
        city?: string;
        speciality?: string;
        limit?: number;
        page?: number;
        for?: 'listing' | 'mostSearched';
    }) => {
        const { for: target, ...rest } = params;
        const q= new URLSearchParams();
        if(rest.name) q.set('name', rest.name);
        if(rest.city) q.set('city', rest.city);
        if(rest.speciality) q.set('speciality', rest.speciality);
        if(rest.page != null ) q.set('page', rest.page.toString());
        if(rest.limit != null)  q.set('limit', rest.limit.toString());

        const res =await fetch(`${BASE}/doctors?${q}`);
        const data = await res.json();
        
        const page = rest.page ?? 1;
        if (target === 'mostSearched') {
          return { data, target: 'mostSearched', page: 1 };
        } else {
          return { data, target: 'listing',page };
        }

    }
);

export const getCities = createAsyncThunk('app/getCities', async () => {
    const res = await fetch(`${BASE}/cities`);
    return res.json();
});

export const getSpecialities = createAsyncThunk('app/getSpecialities', async () => {
    const res = await fetch(`${BASE}/specialities`);
    return res.json();
})

export const getDoctorById = createAsyncThunk('app/getDoctorById', async(id: string) => {
    const res = await fetch(`${BASE}/doctors/${id}`);
    return res.json();
});

export const createDoctor = createAsyncThunk('app/createDoctor', async (body: Record<string,any>) => {
    const res = await fetch(`${BASE}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data= await res.json();
    if(!res.ok) throw new Error(data.msg || 'Failed to create doctor');
    return data;
})



const slice = createSlice({
    name: 'app',
    initialState: {
        doctors: [] as any[],
        mostSearched: [] as any[],
        cities: [] as any[],
        specialities: [] as any[],
        doctorDetail: null as any,
        loading: false,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getDoctors.pending, (state)=> {state.loading=true});
        builder.addCase(getDoctors.fulfilled, (state, action)=> {
            const { data, target, page } =action.payload;
            if(target === 'mostSearched') {
                state.mostSearched=data;
            }else {
                if(page ===1) {
                    state.doctors=data;
                }else {
                    state.doctors=[...state.doctors, ...data];
                }
            }
            state.loading=false;
        });
        builder.addCase(getCities.fulfilled, (state, action) => {
            state.cities=action.payload;
        });
        builder.addCase(getSpecialities.fulfilled, (state, action) => {
            state.specialities = action.payload;
        });
        builder.addCase(getDoctorById.fulfilled, (state,action) => {
            state.doctorDetail=action.payload;
        })
        
    }
});

export const store = configureStore({ reducer: slice.reducer});



