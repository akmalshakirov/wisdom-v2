type Props = {
    domain: {
        name: string;
        zone: string;
        price: number;
    };
};

const domainDetails = ({ domain: { name, price, zone } }: Props) => {
    return name;
};

export default domainDetails;
