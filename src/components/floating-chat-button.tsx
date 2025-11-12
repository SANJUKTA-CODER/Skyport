import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function FloatingChatButton() {
    return (
        <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-lg hover:scale-110 transition-transform duration-300 z-50 btn-glow"
            style={{
                background: "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)))"
            }}
        >
            <MessageSquare className="h-7 w-7" />
            <span className="sr-only">Help & Chat</span>
        </Button>
    )
}
