import { describe,it,expect,vi,beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "./testUtils";
import SearchPage from "../src/pages/SearchPage";
import * as api from "../src/services/api";
vi.mock("../src/services/api",async()=>({...await vi.importActual<typeof import("../src/services/api")>("../src/services/api"),getProducts:vi.fn(),searchProducts:vi.fn()}));
vi.mock("../src/components/ProductGrid",()=>({default:({products}:any)=><div>{products.map((p:any)=><div key={p.id}>{p.title}</div>)}</div>}));
const search=vi.mocked(api.searchProducts), all=vi.mocked(api.getProducts);
beforeEach(()=>vi.clearAllMocks());
describe("SearchPage",()=>{
 it("renders only API search results for query",async()=>{search.mockResolvedValue([{id:1,title:"Matching product",price:1,category:"c",description:"d",image:"i",rating:{rate:1,count:1}}]);renderWithRouter(<SearchPage/>,["/search?q=match"]);expect(await screen.findByText("Matching product")).toBeInTheDocument();expect(screen.getByText(/Results for/)).toBeInTheDocument();expect(search).toHaveBeenCalledWith("match");expect(all).not.toHaveBeenCalled();});
 it("shows empty-state when no results",async()=>{search.mockResolvedValue([]);renderWithRouter(<SearchPage/>,["/search?q=unknown"]);expect(await screen.findByText(/No products found/i)).toBeInTheDocument();});
 it("loads all products without query",async()=>{all.mockResolvedValue([{id:1,title:"Catalog product",price:1,category:"c",description:"d",image:"i",rating:{rate:1,count:1}}]);renderWithRouter(<SearchPage/>);expect(await screen.findByText("Catalog product")).toBeInTheDocument();expect(all).toHaveBeenCalled();});
 it("shows error if fetching fails",async()=>{search.mockRejectedValue(new Error("offline"));renderWithRouter(<SearchPage/>,["/search?q=x"]);expect(await screen.findByText(/Couldn't load products/i)).toBeInTheDocument();});
});
