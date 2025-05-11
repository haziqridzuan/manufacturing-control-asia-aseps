
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { seedDatabase } from "@/utils/seedData";
import { Loader2 } from "lucide-react";

const SeedDataButton = () => {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    
    try {
      const success = await seedDatabase();
      
      if (success) {
        toast({
          title: "Database seeded successfully",
          description: "Mock data has been loaded into your Supabase database.",
          variant: "default",
        });
      } else {
        throw new Error("Failed to seed database");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Error seeding database",
        description: "Check the console for more details.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedData} 
      disabled={isSeeding}
      variant="outline"
      className="mt-4"
    >
      {isSeeding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seeding Database...
        </>
      ) : (
        "Seed Supabase Database"
      )}
    </Button>
  );
};

export default SeedDataButton;
