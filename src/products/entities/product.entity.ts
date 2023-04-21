import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({
        type: 'text',
        unique: true
    })
    name: string

    @Column('float', {
        default: 0
    })
    price: number

    @Column()
    type: string

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column()
    archive: string

    @Column('timestamp')
    date_of_created: string

    @Column('timestamp')
    date_of_updated: string
}
