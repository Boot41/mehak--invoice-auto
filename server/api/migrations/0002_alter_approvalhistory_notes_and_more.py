# Generated by Django 5.0.2 on 2025-03-05 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='approvalhistory',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='invoicedetail',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='invoicedetail',
            name='supplier_address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='invoicedetail',
            name='supplier_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='invoicedetail',
            name='supplier_phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='amount',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='confidence',
            field=models.CharField(blank=True, choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')], max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='confidence_score',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='image_url',
            field=models.URLField(max_length=500),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='number_of_units',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='supplier',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='tax',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='invoiceinfo',
            name='total',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]
