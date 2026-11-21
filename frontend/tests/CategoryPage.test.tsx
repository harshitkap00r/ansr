import { describe,it,expect,vi,beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "./testUtils";
import CategoryPage from "../src/pages/CategoryPage";
import * as api from "../src/services/api";
vi.mock("../src/services/api",async()=>({...await vi.importActual<typeof import("../src/services/api")>("../src/services/api"),getProductsByCategory:vi.fn()}));
vi.mock("../src/components/ProductGrid",()=>({default:({products}:any)=><div>{products.map((p:any)=><div key={p.id}>{p.title}</div>)}</div>}));
const mock=vi.mocked(api.getProductsByCategory);
beforeEach(()=>vi.clearAllMocks());
describe("CategoryPage",()=>{
 it("shows top rated first and remaining products separately",async()=>{mock.mockResolvedValue(Array.from({length:7},(_,i)=>({id:i+1,title:`Item ${i+1}`,price:1,category:"electronics",description:"d",image:"i",rating:{rate:7-i,count:1}}))); renderWithRouter(<CategoryPage/>,["/categories/electronics"]); expect(await screen.findByText("Item 1")).toBeInTheDocument(); expect(screen.getByText("Top rated")).toBeInTheDocument(); expect(screen.getByText("More from this category")).toBeInTheDocument(); expect(screen.getByText("Item 6")).toBeInTheDocument(); expect(screen.getByText("Item 7")).toBeInTheDocument(); });
 it("shows category load error",async()=>{mock.mockRejectedValue(new Error("failure"));renderWithRouter(<CategoryPage/>,["/categories/electronics"]);expect(await screen.findByText(/Couldn't load this category/i)).toBeInTheDocument();});
});
