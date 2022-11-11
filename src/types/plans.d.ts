/**
 * Personalmente creo que debemos estándarizar
 * los beneficions de los planes para restringir
 * los permisos de los usuarios, pero podemos dejar esto por mientras
 */
interface IPlanPerk {
  icon: string;
  description: string;
}

export interface IPlan extends Document {
  id: string;
  name: string;
  slogan: string;
  icon: string;
  type: string;
  price: number;
  include: IPlanPerk[];
}
