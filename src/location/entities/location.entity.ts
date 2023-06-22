import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'locations'})
@ObjectType({
  description: 'Schema where the information of the system locations is stored'
})
export class Location {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'Id automatically generated in integer format eg: 1,2,3..' })
  id: number;


  @Column('text')
  @Field(()=> String, {
    description: 'Geohash Firebase'
  })
  geohash: string


  @Column('text')
  @Field(()=> String, {
    description: 'GeoPoint Firebase'
  })
  geopoint: string


  @Column('text')
  @Field(()=> String, {
    description: 'Status Firebase'
  })
  status: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //Relations
  @ManyToOne(()=> User, (user)=> user.location, {eager:true})
  @JoinColumn({name: 'idUser'})
  @Field(()=> User)
  user:User

}
