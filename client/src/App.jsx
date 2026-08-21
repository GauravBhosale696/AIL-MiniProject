import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Your NGO site starts here 🚀</h1>
      </div>
    </TooltipProvider>
  )
}

export default App