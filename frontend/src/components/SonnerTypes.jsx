import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function SonnerTypes({ isSubmitting, label = "Save Product" }) {
    return (
        <Button
            variant="default"
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
        >
            {isSubmitting ? "Processing..." : label}
        </Button>
    )
}