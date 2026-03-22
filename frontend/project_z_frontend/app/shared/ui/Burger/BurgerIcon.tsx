interface Props{
    onClick:()=>void;
    isOpen:boolean;
}

const BurgerIcon: React.FC<Props> = ({onClick,isOpen})=> {
    
    return (
        <div className={`burger ${isOpen?"active":""}`} onClick={onClick}>
			<span></span>
			<span></span>
			<span></span>
		</div>
    )
};

export default BurgerIcon;