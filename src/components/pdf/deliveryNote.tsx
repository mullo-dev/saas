// components/DeliveryNotePDF.tsx
import { Image, Text, View } from '@react-pdf/renderer';

export const DeliveryNotePDF = ({ supplier, order, all } : { supplier?: any, order?: any, all?: boolean }) => (
  <View>
    <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
      Bon de commande
    </Text>
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
        Demandeur : {order.customer.name}
      </Text>
      <Text style={{fontSize: "8px", marginBottom: 5}}>
        Contact : {order.customer.email}
      </Text>
      <Text style={{fontSize: "8px"}}>
        Adresse : 10 rue Cabronne 75015 Paris
      </Text>
    </View>
    {all ? order.suppliers.map((sup:any, index:number) => (
      <View
        key={index}
        style={{paddingTop: 20}}
      >
        <Text style={{fontSize: "10px", marginBottom: 8}}>Fournisseur : {sup.supplier.name}</Text>
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
          {sup?.products?.map((product:any, index:number) => (
            <View
              key={index}
              style={{
                position: "relative",
                height: 15,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 2,
                borderBottom: "0.01rem solid black"
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
          ))}
          <View
            style={{
              position: "relative",
              height: 15,
              marginLeft: 5,
              marginRight: 5,
              marginBottom: 2
            }}
          >
            <Text style={{fontSize: 8, textAlign: "right"}}>Total : {sup?.products.reduce((acc: number, p: any) => acc + p.price, 0).toFixed(2)} € HT</Text>
        </View>
        </View>
      </View>
    )) :
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
          {supplier?.products?.map((product:any, index:number) => (
            <View
              key={index}
              style={{
                position: "relative",
                height: 15,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 2,
                borderBottom: "0.01rem solid black"
              }}
            >
              <View style={{position: "absolute", width: "70%"}}>
                <Text style={{fontSize: 8}}>{product.product.name}</Text>
              </View>
              <View style={{position: "absolute", width: "10%", left: "70%"}}>
                <Text style={{fontSize: 8}}>{(product.price/product.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</Text>
              </View>
              <View style={{position: "absolute", width: "10%", left: "80%"}}>
                <Text style={{fontSize: 8}}>{product.quantity}</Text>
              </View>
              <View style={{position: "absolute", width: "10%", left: "90%"}}>
                <Text style={{fontSize: 8, textAlign: "right"}}>{product.price.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</Text>
              </View>
            </View>
          ))}
            <View
              style={{
                position: "relative",
                height: 15,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 2
              }}
            >
              <Text style={{fontSize: 8, textAlign: "right"}}>Total : {supplier?.products.reduce((acc: number, p: any) => acc + p.price, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € HT</Text>
          </View>
        </View>
      </View>
    }
    <Text style={{marginTop: 10, color: "gray", fontSize: 7, width: "50%", fontStyle: "italic" }}>
      Ce papier ne constitue pas une preuve de règlement : il atteste seulement le passage d'une commande. Les fournisseurs sont en devoir de fournir une facture correspondante.
    </Text>
    <Text style={{marginTop: 4, color: "gray", fontSize: 8 }}>
      Généré avec 
      <Image 
        src="/logo.png"
        style={{ width: 30, marginLeft: 2 }}
      />
    </Text>
  </View>
);
