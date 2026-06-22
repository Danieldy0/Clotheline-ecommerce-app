import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartPieLabelCustom } from "@/components/ChartPieLabelCustom"
import { DataTableDemo } from "@/components/date-table"

export function SectionCards() {
    return (
        <div className="md:grid grid-col-2  @xl/main:grid-cols-2 @5xl/main:grid-cols-2 gap-4">
            <div className="*:data-[slot=card]:shadow-sm @xl/main:grid-cols-2 @5xl/main:grid-cols-2 grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
                <Card data-slot="card" className="@container/card shadow-none">
                    <CardHeader className="relative">
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            $1,250.00
                        </CardTitle>
                        <div className="absolute right-4 top-4">
                            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                <TrendingUpIcon className="size-3" />
                                +12.5%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <TrendingUpIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
                <Card data-slot="card" className="@container/card shadow-none">
                    <CardHeader className="relative">
                        <CardDescription>New Customers</CardDescription>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            1,234
                        </CardTitle>
                        <div className="absolute right-4 top-4">
                            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                <TrendingDownIcon className="size-3" />
                                -20%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Down 20% this period <TrendingDownIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Acquisition needs attention
                        </div>
                    </CardFooter>
                </Card>
                <Card data-slot="card" className="@container/card shadow-none">
                    <CardHeader className="relative">
                        <CardDescription>New Customers</CardDescription>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            1,234
                        </CardTitle>
                        <div className="absolute right-4 top-4">
                            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                <TrendingDownIcon className="size-3" />
                                -20%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Down 20% this period <TrendingDownIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Acquisition needs attention
                        </div>
                    </CardFooter>
                </Card>
                <Card data-slot="card" className="@container/card shadow-none">
                    <CardHeader className="relative">
                        <CardDescription>New Customers</CardDescription>
                        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            1,234
                        </CardTitle>
                        <div className="absolute right-4 top-4">
                            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                <TrendingDownIcon className="size-3" />
                                -20%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Down 20% this period <TrendingDownIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Acquisition needs attention
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <DataTableDemo />
        </div>
    )
}
