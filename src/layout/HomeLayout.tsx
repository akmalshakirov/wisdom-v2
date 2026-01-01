import { HeaderHero } from "../components/header";
import { Click } from "../components/ui/click";

const HomeLayout = () => {
    return (
        <div className='bg-primary relative max-h-dvh h-screen flex items-center justify-center'>
            <Click>
                <HeaderHero />
            </Click>
        </div>
    );
};

export default HomeLayout;
