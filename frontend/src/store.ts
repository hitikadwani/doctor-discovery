import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = 'http:localhost:5000/api';



export const getDoctors = createAsyncThunk('doctors/getDoctors',
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

        if (target === 'mostSearched') {
          return { data, target: 'mostSearched' };
        } else {
          return { data, target: 'listing' };
        }

    }
);

//export const cities 

//export const specialities

const slice = createSlice({
    name: 'app',
    initialState: {
        doctors: [] as any[],
        mostSearched: [] as any[],
        cities: [] as any[],
        specialities: [] as any[],
        loading: false,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getDoctors.pending, (state)=> {state.loading=true});
        builder.addCase(getDoctors.fulfilled, (state, action)=> {
            const { data, target } =action.payload;
            if(target === 'mostSearched') {
                state.mostSearched=data;
            }else state.doctors=data;
            state.loading=false;
        });
        builder.addCase(getCities.fulfilled, (state, action) => {
            state.cities=action.payload;
        });
        builder.addCase(getSpecialities.fulfilled, (state, action) => {
            state.specialities = action.payload;
        })

    }
});

export const store = configureStore({ reducer: slice.reducer});



