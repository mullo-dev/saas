// components/DeliveryNotePDF.tsx
import { Document, Page, Text, View } from '@react-pdf/renderer';

export const DeliveryNotePDF = ({ supplier, order, products } : { supplier?: any, order?: any, products?: any }) => (
  <View>
    <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Bon de Livraison</Text>
    <View 
      style={{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor: "#92BA9A",
        borderRadius: 5,
        width: "50%"
      }}
    >
      <Text style={{fontSize: "12px", marginBottom: 5, fontWeight: "bold"}}>
        Commande n° {order.ref}
      </Text>
      <Text style={{fontSize: "8px", fontStyle: "italic", marginBottom: 10}}>
        Date : {new Date(order.createdAt).toLocaleDateString()}
      </Text>
      <Text style={{fontSize: "8px", marginBottom: 5}}>
        Demandeur : {order.customerId}
      </Text>
      <Text style={{fontSize: "8px"}}>
        Adresse : 10 rue Cabronne 75015 Paris
      </Text>
    </View>
    <View
      style={{paddingTop: 20}}
    >
      <Text style={{fontSize: "10px", marginBottom: 8}}>Fournisseur : {supplier.supplier.name}</Text>
      <View
        style={{
          border: "0.03rem solid gray",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "gray",
            position: "relative",
            height: 20,
            marginBottom: 5
          }}
        >
          <View style={{position: "absolute", width: "70%", top: 5, left: 5}}>
            <Text style={{fontSize: 8}}>Nom</Text>
          </View>
          <View style={{position: "absolute", width: "10%", left: "70%", top: 5}}>
            <Text style={{fontSize: 8}}>Prix</Text>
          </View>
          <View style={{position: "absolute", width: "10%", left: "80%", top: 5}}>
            <Text style={{fontSize: 8}}>Quantité</Text>
          </View>
          <View style={{position: "absolute", width: "10%", top: 5, right: 5}}>
            <Text style={{fontSize: 8, textAlign: "right"}}>Total</Text>
          </View>
        </View>
        {products?.map((product:any, index:number) => {
          const border = index !== products.length-1 ? "0.01rem solid black" : ""
          
          return (
            <View
              key={index}
              style={{
                position: "relative",
                height: 15,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 2,
                borderBottom: border
              }}
            >
              <View style={{position: "absolute", width: "70%"}}>
                <Text style={{fontSize: 8}}>{product.product.name}</Text>
              </View>
              <View style={{position: "absolute", width: "10%", left: "70%"}}>
                <Text style={{fontSize: 8}}>{(product.price/product.quantity).toFixed(2)} €</Text>
              </View>
              <View style={{position: "absolute", width: "10%", left: "80%"}}>
                <Text style={{fontSize: 8}}>{product.quantity}</Text>
              </View>
              <View style={{position: "absolute", width: "10%", left: "90%"}}>
                <Text style={{fontSize: 8, textAlign: "right"}}>{product.price.toFixed(2)} €</Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  </View>
);
