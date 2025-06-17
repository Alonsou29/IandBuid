import TablaOccupations from "@/Components/tablaOccupation";

export default function Tabla({occupations}) {

    // const [OccupationSeleccionado, setOccupationSeleccionado] = useState(null);

    // const handleOccupationSeleccionado = (occupation) => {
    // setOccupationSeleccionado(occupation);
//   };
    return(

        <div>
            <TablaOccupations
            occupations={occupations}
            // onOccupationSeleccionado={handleOccupationSeleccionado}
            ></TablaOccupations>
        </div>
    );

}
