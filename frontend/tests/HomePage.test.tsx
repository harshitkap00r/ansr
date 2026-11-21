import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "./testUtils";
import HomePage from "../src/pages/HomePage";
import * as api from "../src/services/api";
vi.mock("../src/services/api", async () => ({ ...(await vi.importActual<typeof import("../src/services/api")>("../src/services/api")), getFeaturedProducts: vi.fn() }));
vi.mock("../src/components/ProductGrid", () => ({ default: ({products}: any) => <div>{products.map((p:any)=><div key={p.id}>{p.title}</div>)}</div> }));
const mock=vi.mocked(api.getFeaturedProducts);
beforeEach(()=>vi.clearAllMocks());
describe("HomePage",()=>{
 it("renders featured products from the API",async()=>{mock.mockResolvedValue(Array.from({length:5},(_,i)=>({id:i+1,title:`Featured ${i+1}`,price:1,category:"c",description:"d",image:"i",rating:{rate:5,count:1}}))); renderWithRouter(<HomePage/>); expect(await screen.findByText("Featured 1")).toBeInTheDocument(); expect(screen.getByText("Featured 5")).toBeInTheDocument(); expect(screen.getByText("Featured products")).toBeInTheDocument();});
 it("shows an error when the API fails",async()=>{mock.mockRejectedValue(new Error("offline")); renderWithRouter(<HomePage/>); expect(await screen.findByText(/Couldn't connect/i)).toBeInTheDocument();});
});
