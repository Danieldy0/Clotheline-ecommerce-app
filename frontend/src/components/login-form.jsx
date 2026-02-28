import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function LoginForm({
    className,
    ...props
}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('') // Clear previous errors
        try {
            const url = `http://127.0.0.1:8000/api/login/?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (response.ok) {
                // Save "logged in" user so the Profile menu can read it
                localStorage.setItem('currentUser', JSON.stringify(data))
                // Redirect to administration home
                navigate('/administration', { state: { showLogModal: true } })
            } else {
                setError(data.error || 'Credentials do not match')
            }
        } catch (error) {
            console.error(error)
            setError('Error checking credentials')
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-white/40 backdrop-blur-md shadow-xl border border-gray-200/80">
                <CardHeader className="text-center ">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Administrator
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && (
                                    <p className="text-destructive text-sm font-medium">{error}</p>
                                )}
                                <Button type="submit" className="w-full text-white bg-gray-600 hover:bg-gray-700">
                                    Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
