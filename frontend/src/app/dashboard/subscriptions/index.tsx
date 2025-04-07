import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
 } from "@/components/ui/tabs"

export default function Subscriptions() {
    return (
        <div className="flex flex-col gap-16 items-center">
            <div className="font-bold text-3xl">Manage your Subscriptions</div>
            <div className="flex justify-center">
                <Tabs defaultValue="Current Plan" className="w-full">
                    <TabsList>
                        <TabsTrigger value="Current Plan" className="w-[12.5rem]">Current Plan</TabsTrigger>
                        <TabsTrigger value="Billing History" className="w-[12.5rem]">Billing History</TabsTrigger>
                        <TabsTrigger value="Available Plans" className="w-[12.5rem]">Available Plans</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Current Plan" className="my-8">
                        <div className="text-center">Current Plan</div>
                    </TabsContent>
                    <TabsContent value="Billing History" className="my-8">
                        <div className="text-center">Billing History</div>
                    </TabsContent>
                    <TabsContent value="Available Plans" className="my-8">
                        <div className="text-center">Available Plans</div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}